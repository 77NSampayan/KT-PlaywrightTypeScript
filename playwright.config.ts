import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Define test user credentials from environment variables (GitHub Secrets)
export const superAdminCredentials = {
  username: process.env.SUPER_ADMIN_USERNAME || 'update_in_env_file',
  password: process.env.SUPER_ADMIN_PASSWORD || 'update_in_env_file'
};

// export const testUser2 = {
//   email: process.env.CHICHAY_BOY_QA_EMAIL || 'update_in_env_file',
//   password: process.env.CHICHAY_BOY_QA_PASSWORD || 'update_in_env_file'
// };

/**
 * See https://playwright.dev/docs/test-configuration for more information.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: process.env.CI ? 'never' : 'on-failure' }],
    ['list'],
    ['./src/utils/logger-util.ts'] // Custom logger
  ],
  /* Global timeout for each test */
  timeout: 120000, // 2 minutes

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot on failure. */
    screenshot: 'only-on-failure',

    /* Record video on failure. */
    video: 'retain-on-failure',

    /* Headless mode */
    headless: process.env.HEADLESS === 'true' || !!process.env.CI,

    /* Test ID attribute */
    testIdAttribute: 'data-qa',

    /* Action timeout */
    actionTimeout: 10000, // 10 seconds

    /* Navigation timeout */
    navigationTimeout: 30000, // 30 seconds

    /* Context timeout */
    serviceWorkers: 'block',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        // Selectively pick properties from devices['Desktop Chrome'] that don't conflict with viewport: null
        userAgent: devices['Desktop Chrome'].userAgent,
        isMobile: devices['Desktop Chrome'].isMobile,
        // Add other non-viewport related properties from devices['Desktop Chrome'] if needed
        launchOptions: {
          args: ['--start-maximized'],
          slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO, 10) : 0,
        },
        viewport: null, // Use the full viewport size
      },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
