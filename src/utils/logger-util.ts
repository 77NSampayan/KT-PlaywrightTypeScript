import * as winston from 'winston';
import { FullConfig } from '@playwright/test'; // Revert to named import

// Define a type for log metadata for better type safety
type LogMetadata = Record<string, any>;

// Define minimal inline types for reporter parameters to avoid import issues
interface TestCase {
  title: string;
  project: {
    name: string;
  };
}

interface TestResult {
  title: string;
  error?: {
    message: string;
    stack?: string;
  };
  duration: number;
  status: 'passed' | 'failed' | 'timedOut' | 'skipped'; // Add other statuses if needed
}

interface Suite {
  status: 'passed' | 'failed' | 'timedOut';
  passed: number;
  failed: number;
}

/**
 * LoggerUtil class provides a centralized and configurable logging mechanism
 * for the test framework using Winston.
 */
export class Logger {
  private logger: winston.Logger;

  /**
   * Initializes the logger with default or custom configurations.
   * @param testName - Optional test name to include in log messages.
   */
  constructor(testName?: string) {
    const logFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let logMessage = `${timestamp} [${level.toUpperCase()}]`;
        if (testName) {
          logMessage += ` [${testName}]`;
        }
        logMessage += `: ${message}`;
        if (Object.keys(meta).length > 0) {
          logMessage += ` ${JSON.stringify(meta)}`;
        }
        if (stack) {
          logMessage += `\n${stack}`;
        }
        return logMessage;
      })
    );

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info', // Default to 'info', can be overridden by env var
      format: logFormat,
      transports: [
        // Console transport for outputting logs to the console
        new winston.transports.Console({
          level: process.env.LOG_LEVEL || 'info',
          format: winston.format.combine(
            winston.format.colorize(), // Colorize console output
            logFormat
          ),
        }),
        // File transport for storing all logs
        new winston.transports.File({
          filename: 'logs/test-run.log',
          level: 'debug', // Log everything to the file
          maxsize: 5 * 1024 * 1024, // 5MB
          maxFiles: 5, // Keep up to 5 log files
          tailable: true,
        }),
        // Separate file for errors only
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          maxsize: 5 * 1024 * 1024, // 5MB
          maxFiles: 3,
          tailable: true,
        }),
      ],
    });
  }

  /**
   * Logs an informational message.
   * @param message - The message to log.
   * @param meta - Optional metadata to include.
   */
  info(message: string, meta?: LogMetadata): void {
    this.logger.info(message, meta);
  }

  /**
   * Logs a warning message.
   * @param message - The message to log.
   * @param meta - Optional metadata to include.
   */
  warn(message: string, meta?: LogMetadata): void {
    this.logger.warn(message, meta);
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param meta - Optional metadata to include.
   */
  error(message: string, meta?: LogMetadata): void {
    this.logger.error(message, meta);
  }

  /**
   * Logs a debug message.
   * @param message - The message to log.
   * @param meta - Optional metadata to include.
   */
  debug(message: string, meta?: LogMetadata): void {
    this.logger.debug(message, meta);
  }
}

// --- Playwright Reporter Integration ---

/**
 * A custom Playwright reporter that uses the LoggerUtil for test execution output.
 * This reporter integrates with Playwright's test runner to provide structured logging.
 */
export default class CustomLoggerReporter {
  private logger: Logger;

  constructor() {
    // A general logger for reporter-level messages
    this.logger = new Logger('Reporter');
  }

  /**
   * Called when a test suite begins.
   * @param suite - The test suite object.
   */
  onBegin(config: FullConfig): void {
    const projectCount = config?.projects?.length || 0;
    this.logger.info(`Starting test run with ${projectCount} project(s).`);
  }

  /**
   * Called when a test begins.
   * @param test - The test object.
   */
  onTestBegin(test: TestCase): void {
    // Add null checks to prevent type errors
    const testName = test?.title || 'Unknown Test';
    const projectName = test?.project?.name || 'Unknown Project';
    
    // We can create a logger instance specific to this test
    // and pass it to the test via testInfo, but for now, we'll just log here.
    this.logger.info(`Test Started: ${testName} (Project: ${projectName})`);
  }

  /**
   * Called when a test step begins.
   * @param test - The test object.
   * @param result - The test result object.
   */
  onStepBegin(test: TestCase, result: TestResult): void {
    const testName = test?.title || 'Unknown Test';
    const stepTitle = result?.title || 'Unknown Step';
    this.logger.debug(`Step Started: ${stepTitle}`, { test: testName });
  }

  /**
   * Called when a test step ends.
   * @param test - The test object.
   * @param result - The test result object.
   */
  onStepEnd(test: TestCase, result: TestResult): void {
    const testName = test?.title || 'Unknown Test';
    const stepTitle = result?.title || 'Unknown Step';
    const status = result?.error ? 'FAILED' : 'PASSED';
    const duration = result?.duration || 0;
    
    this.logger.debug(`Step Ended: ${stepTitle} - ${status}`, { test: testName, duration });
    if (result?.error) {
      this.logger.error(`Step Error: ${stepTitle} - ${result.error.message}`, { test: testName, stack: result.error.stack });
    }
  }

  /**
   * Called when a test ends.
   * @param test - The test object.
   * @param result - The test result object.
   */
  onTestEnd(test: TestCase, result: TestResult): void {
    const testName = test?.title || 'Unknown Test';
    const status = result?.status?.toUpperCase() || 'UNKNOWN';
    const duration = result?.duration || 0;
    
    this.logger.info(`Test Ended: ${testName} - ${status} (${duration}ms)`);
    if (result?.status === 'failed' && result?.error) {
      this.logger.error(`Test Failure: ${testName} - ${result.error.message}`, { stack: result.error.stack });
    }
  }

  /**
   * Called when the test suite ends.
   * @param result - The result of the test suite.
   */
  onEnd(result: Suite): void {
    const status = result?.status || 'unknown';
    const passedCount = result?.passed || 0;
    const failedCount = result?.failed || 0;
    
    this.logger.info(`Test run finished. Status: ${status}`);
    if (status === 'failed') {
      this.logger.error(`${failedCount} test(s) failed, ${passedCount} test(s) passed.`);
    } else {
      this.logger.info(`All ${passedCount} test(s) passed.`);
    }
  }

  /**
   * Called when an error occurs outside of test execution.
   * @param error - The error that occurred.
   */
  onError(error: Error): void {
    this.logger.error(`Global Error: ${error.message}`, { stack: error.stack });
  }
}
