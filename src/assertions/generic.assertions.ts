import { expect } from '@playwright/test';
import { Logger } from '@utils/logger-util';

type MatcherConstructor = abstract new (...args: any[]) => unknown;

/**
 * GenericAssertions class provides a centralized place for all Playwright generic assertions.
 * This class wraps Playwright's built-in expect matchers for generic value assertions.
 * Reference: https://playwright.dev/docs/api/class-genericassertions
 */
export class GenericAssertions {
  private readonly logger: Logger;

  /**
   * @param logger - An instance of the Logger utility for consistent logging.
   */
  constructor(logger: Logger) {
    this.logger = logger;
  }

  // --- Matcher Utilities ---

  /**
   * `expect.any()` matches any object instance created from the constructor or a corresponding primitive type.
   * Use it inside toEqual() to perform pattern matching.
   * @param constructor - Constructor of the expected object like `ExampleClass`, or a primitive boxed type like `Number`.
   * @returns A matcher object for use in toEqual assertions.
   */
  any(constructor: MatcherConstructor) {
    return expect.any(constructor);
  }

  /**
   * `expect.anything()` matches everything except `null` and `undefined`.
   * Use it inside toEqual() to perform pattern matching.
   * @returns A matcher object for use in toEqual assertions.
   */
  anything() {
    return expect.anything();
  }

  /**
   * `expect.arrayContaining()` matches an array that contains all of the elements in the expected array, in any order.
   * @param expected - Expected array that is a subset of the received value.
   * @returns A matcher object for use in toEqual assertions.
   */
  arrayContaining(expected: Array<any>) {
    return expect.arrayContaining(expected);
  }

  /**
   * `expect.arrayOf()` matches array of objects created from the constructor or a corresponding primitive type.
   * @param constructor - Constructor of the expected object like `ExampleClass`, or a primitive boxed type like `Number`.
   * @returns A matcher object for use in toEqual assertions.
   */
  arrayOf(constructor: MatcherConstructor) {
    return expect.arrayOf(constructor);
  }

  /**
   * Compares floating point numbers for approximate equality.
   * Use this method inside toEqual() to perform pattern matching.
   * @param expected - Expected value.
   * @param numDigits - The number of decimal digits after the decimal point that must be equal.
   * @returns A matcher object for use in toEqual assertions.
   */
  closeTo(expected: number, numDigits?: number) {
    return expect.closeTo(expected, numDigits);
  }

  /**
   * `expect.objectContaining()` matches an object that contains and matches all of the properties in the expected object.
   * @param expected - Expected object pattern that contains a subset of the properties.
   * @returns A matcher object for use in toEqual assertions.
   */
  objectContaining(expected: Record<string, any>) {
    return expect.objectContaining(expected);
  }

  /**
   * `expect.stringContaining()` matches a string that contains the expected substring.
   * @param expected - Expected substring.
   * @returns A matcher object for use in toEqual assertions.
   */
  stringContaining(expected: string) {
    return expect.stringContaining(expected);
  }

  /**
   * `expect.stringMatching()` matches a received string that in turn matches the expected pattern.
   * @param expected - Pattern that expected string should match.
   * @returns A matcher object for use in toEqual assertions.
   */
  stringMatching(expected: string | RegExp) {
    return expect.stringMatching(expected);
  }

  // --- Value Assertions ---

  /**
   * Compares value with expected by calling `Object.is`.
   * This method compares objects by reference instead of their contents.
   * @param value - The value to assert.
   * @param expected - Expected value.
   */
  async toBe(value: any, expected: unknown): Promise<void> {
    try {
      this.logger.info(`Asserting value to be: "${expected}"`);
      expect(value).toBe(expected);
      this.logger.info(`Assertion passed: Value is "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBe assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compares floating point numbers for approximate equality.
   * Use this method instead of toBe() when comparing floating point numbers.
   * @param value - The value to assert.
   * @param expected - Expected value.
   * @param numDigits - The number of decimal digits after the decimal point that must be equal.
   */
  async toBeCloseTo(value: number, expected: number, numDigits?: number): Promise<void> {
    try {
      this.logger.info(`Asserting value to be close to: "${expected}" with ${numDigits || 2} decimal digits`);
      expect(value).toBeCloseTo(expected, numDigits);
      this.logger.info(`Assertion passed: Value is close to "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is close to "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeCloseTo assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is not `undefined`.
   * @param value - The value to assert.
   */
  async toBeDefined(value: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to be defined`);
      expect(value).toBeDefined();
      this.logger.info(`Assertion passed: Value is defined.`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is defined. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeDefined assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is false in a boolean context.
   * @param value - The value to assert.
   */
  async toBeFalsy(value: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to be falsy`);
      expect(value).toBeFalsy();
      this.logger.info(`Assertion passed: Value is falsy.`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is falsy. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeFalsy assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that `value > expected` for number or big integer values.
   * @param value - The value to assert.
   * @param expected - The value to compare to.
   */
  async toBeGreaterThan(value: number | bigint, expected: number | bigint): Promise<void> {
    try {
      this.logger.info(`Asserting value to be greater than: "${expected}"`);
      expect(value).toBeGreaterThan(expected);
      this.logger.info(`Assertion passed: Value is greater than "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is greater than "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeGreaterThan assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that `value >= expected` for number or big integer values.
   * @param value - The value to assert.
   * @param expected - The value to compare to.
   */
  async toBeGreaterThanOrEqual(value: number | bigint, expected: number | bigint): Promise<void> {
    try {
      this.logger.info(`Asserting value to be greater than or equal to: "${expected}"`);
      expect(value).toBeGreaterThanOrEqual(expected);
      this.logger.info(`Assertion passed: Value is greater than or equal to "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is greater than or equal to "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeGreaterThanOrEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is an instance of a class.
   * @param value - The value to assert.
   * @param expected - The class or constructor function.
   */
  async toBeInstanceOf(value: any, expected: MatcherConstructor): Promise<void> {
    try {
      const expectedName = (expected as { name: string }).name;
      this.logger.info(`Asserting value to be instance of: "${expectedName}"`);
      expect(value).toBeInstanceOf(expected);
      this.logger.info(`Assertion passed: Value is instance of "${expectedName}".`);
    } catch (error) {
      const expectedName = (expected as { name: string }).name;
      const errorMessage = `Failed to assert that value is instance of "${expectedName}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeInstanceOf assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that `value < expected` for number or big integer values.
   * @param value - The value to assert.
   * @param expected - The value to compare to.
   */
  async toBeLessThan(value: number | bigint, expected: number | bigint): Promise<void> {
    try {
      this.logger.info(`Asserting value to be less than: "${expected}"`);
      expect(value).toBeLessThan(expected);
      this.logger.info(`Assertion passed: Value is less than "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is less than "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeLessThan assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that `value <= expected` for number or big integer values.
   * @param value - The value to assert.
   * @param expected - The value to compare to.
   */
  async toBeLessThanOrEqual(value: number | bigint, expected: number | bigint): Promise<void> {
    try {
      this.logger.info(`Asserting value to be less than or equal to: "${expected}"`);
      expect(value).toBeLessThanOrEqual(expected);
      this.logger.info(`Assertion passed: Value is less than or equal to "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is less than or equal to "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeLessThanOrEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is `NaN`.
   * @param value - The value to assert.
   */
  async toBeNaN(value: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to be NaN`);
      expect(value).toBeNaN();
      this.logger.info(`Assertion passed: Value is NaN.`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is NaN. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeNaN assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is `null`.
   * @param value - The value to assert.
   */
  async toBeNull(value: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to be null`);
      expect(value).toBeNull();
      this.logger.info(`Assertion passed: Value is null.`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is null. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeNull assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is true in a boolean context.
   * @param value - The value to assert.
   */
  async toBeTruthy(value: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to be truthy`);
      expect(value).toBeTruthy();
      this.logger.info(`Assertion passed: Value is truthy.`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is truthy. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeTruthy assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is `undefined`.
   * @param value - The value to assert.
   */
  async toBeUndefined(value: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to be undefined`);
      expect(value).toBeUndefined();
      this.logger.info(`Assertion passed: Value is undefined.`);
    } catch (error) {
      const errorMessage = `Failed to assert that value is undefined. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toBeUndefined assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that string value contains an expected substring.
   * @param value - The string value to assert.
   * @param expected - Expected substring.
   */
  async toContain(value: string, expected: string): Promise<void> {
    try {
      this.logger.info(`Asserting string to contain: "${expected}"`);
      expect(value).toContain(expected);
      this.logger.info(`Assertion passed: String contains "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that string contains "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toContain assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is an `Array` or `Set` and contains an expected item.
   * @param value - The array or set to assert.
   * @param expected - Expected value in the collection.
   */
  async toContainItem(value: Array<any> | Set<any>, expected: any): Promise<void> {
    try {
      this.logger.info(`Asserting collection to contain item: "${expected}"`);
      expect(value).toContain(expected);
      this.logger.info(`Assertion passed: Collection contains "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that collection contains "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toContainItem assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value is an `Array` or `Set` and contains an item equal to the expected.
   * @param value - The array or set to assert.
   * @param expected - Expected value in the collection.
   */
  async toContainEqual(value: Array<any> | Set<any>, expected: any): Promise<void> {
    try {
      this.logger.info(`Asserting collection to contain equal item: "${expected}"`);
      expect(value).toContainEqual(expected);
      this.logger.info(`Assertion passed: Collection contains equal item "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that collection contains equal item "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toContainEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compares contents of the value with contents of expected, performing "deep equality" check.
   * @param value - The value to assert.
   * @param expected - Expected value.
   */
  async toEqual(value: any, expected: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to equal: "${JSON.stringify(expected)}"`);
      expect(value).toEqual(expected);
      this.logger.info(`Assertion passed: Value equals "${JSON.stringify(expected)}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value equals "${JSON.stringify(expected)}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that value has a `.length` property equal to expected.
   * @param value - The value to assert.
   * @param expected - Expected length.
   */
  async toHaveLength(value: { length: number }, expected: number): Promise<void> {
    try {
      this.logger.info(`Asserting value to have length: "${expected}"`);
      expect(value).toHaveLength(expected);
      this.logger.info(`Assertion passed: Value has length "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value has length "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toHaveLength assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that property at provided keyPath exists on the object and optionally checks that property is equal to the expected.
   * @param value - The object to assert.
   * @param keyPath - Path to the property.
   * @param expected - Optional expected value to compare the property to.
   */
  async toHaveProperty(value: any, keyPath: string, expected?: any): Promise<void> {
    try {
      this.logger.info(`Asserting object to have property: "${keyPath}"${expected !== undefined ? ` with value "${expected}"` : ''}`);
      if (expected !== undefined) {
        expect(value).toHaveProperty(keyPath, expected);
        this.logger.info(`Assertion passed: Object has property "${keyPath}" with value "${expected}".`);
      } else {
        expect(value).toHaveProperty(keyPath);
        this.logger.info(`Assertion passed: Object has property "${keyPath}".`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that object has property "${keyPath}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toHaveProperty assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Ensures that string value matches a regular expression.
   * @param value - The string value to assert.
   * @param expected - Regular expression to match against.
   */
  async toMatch(value: string, expected: RegExp | string): Promise<void> {
    try {
      this.logger.info(`Asserting string to match: "${expected}"`);
      expect(value).toMatch(expected);
      this.logger.info(`Assertion passed: String matches "${expected}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that string matches "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toMatch assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compares contents of the value with contents of expected, performing "deep equality" check.
   * Allows extra properties to be present in the value.
   * @param value - The value to assert.
   * @param expected - The expected object value to match against.
   */
  async toMatchObject(value: any, expected: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to match object: "${JSON.stringify(expected)}"`);
      expect(value).toMatchObject(expected);
      this.logger.info(`Assertion passed: Value matches object "${JSON.stringify(expected)}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value matches object "${JSON.stringify(expected)}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toMatchObject assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Compares contents of the value with contents of expected and their types.
   * @param value - The value to assert.
   * @param expected - Expected value.
   */
  async toStrictEqual(value: any, expected: any): Promise<void> {
    try {
      this.logger.info(`Asserting value to strictly equal: "${JSON.stringify(expected)}"`);
      expect(value).toStrictEqual(expected);
      this.logger.info(`Assertion passed: Value strictly equals "${JSON.stringify(expected)}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that value strictly equals "${JSON.stringify(expected)}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toStrictEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calls the function and ensures it throws an error.
   * @param fn - The function to call.
   * @param expected - Expected error message or error object.
   */
  async toThrow(fn: () => void, expected?: any): Promise<void> {
    try {
      this.logger.info(`Asserting function to throw${expected ? ` with expected error: "${expected}"` : ''}`);
      if (expected !== undefined) {
        expect(fn).toThrow(expected);
        this.logger.info(`Assertion passed: Function throws with expected error.`);
      } else {
        expect(fn).toThrow();
        this.logger.info(`Assertion passed: Function throws.`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that function throws. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toThrow assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * An alias for toThrow().
   * @param fn - The function to call.
   * @param expected - Expected error message or error object.
   */
  async toThrowError(fn: () => void, expected?: any): Promise<void> {
    try {
      this.logger.info(`Asserting function to throw error${expected ? ` with expected error: "${expected}"` : ''}`);
      if (expected !== undefined) {
        expect(fn).toThrowError(expected);
        this.logger.info(`Assertion passed: Function throws error with expected error.`);
      } else {
        expect(fn).toThrowError();
        this.logger.info(`Assertion passed: Function throws error.`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that function throws error. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`toThrowError assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Provides access to the negated matcher versions.
   * For example: genericAssertions.not.toBe(value, expected);
   */
  get not() {
    return {
      toBe: (value: any, expected: any) => {
        try {
          this.logger.info(`Asserting value NOT to be: "${expected}"`);
          expect(value).not.toBe(expected);
          this.logger.info(`Assertion passed: Value is NOT "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBe assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeCloseTo: (value: number, expected: number, numDigits?: number) => {
        try {
          this.logger.info(`Asserting value NOT to be close to: "${expected}"`);
          expect(value).not.toBeCloseTo(expected, numDigits);
          this.logger.info(`Assertion passed: Value is NOT close to "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT close to "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeCloseTo assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeDefined: (value: any) => {
        try {
          this.logger.info(`Asserting value NOT to be defined`);
          expect(value).not.toBeDefined();
          this.logger.info(`Assertion passed: Value is NOT defined.`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT defined. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeDefined assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeFalsy: (value: any) => {
        try {
          this.logger.info(`Asserting value NOT to be falsy`);
          expect(value).not.toBeFalsy();
          this.logger.info(`Assertion passed: Value is NOT falsy.`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT falsy. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeFalsy assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeGreaterThan: (value: number | bigint, expected: number | bigint) => {
        try {
          this.logger.info(`Asserting value NOT to be greater than: "${expected}"`);
          expect(value).not.toBeGreaterThan(expected);
          this.logger.info(`Assertion passed: Value is NOT greater than "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT greater than "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeGreaterThan assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeGreaterThanOrEqual: (value: number | bigint, expected: number | bigint) => {
        try {
          this.logger.info(`Asserting value NOT to be greater than or equal to: "${expected}"`);
          expect(value).not.toBeGreaterThanOrEqual(expected);
          this.logger.info(`Assertion passed: Value is NOT greater than or equal to "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT greater than or equal to "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeGreaterThanOrEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeInstanceOf: (value: any, expected: MatcherConstructor) => {
        try {
          const expectedName = (expected as { name: string }).name;
          this.logger.info(`Asserting value NOT to be instance of: "${expectedName}"`);
          expect(value).not.toBeInstanceOf(expected);
          this.logger.info(`Assertion passed: Value is NOT instance of "${expectedName}".`);
        } catch (error) {
          const expectedName = (expected as { name: string }).name;
          const errorMessage = `Failed to assert that value is NOT instance of "${expectedName}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeInstanceOf assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeLessThan: (value: number | bigint, expected: number | bigint) => {
        try {
          this.logger.info(`Asserting value NOT to be less than: "${expected}"`);
          expect(value).not.toBeLessThan(expected);
          this.logger.info(`Assertion passed: Value is NOT less than "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT less than "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeLessThan assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeLessThanOrEqual: (value: number | bigint, expected: number | bigint) => {
        try {
          this.logger.info(`Asserting value NOT to be less than or equal to: "${expected}"`);
          expect(value).not.toBeLessThanOrEqual(expected);
          this.logger.info(`Assertion passed: Value is NOT less than or equal to "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT less than or equal to "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeLessThanOrEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeNaN: (value: any) => {
        try {
          this.logger.info(`Asserting value NOT to be NaN`);
          expect(value).not.toBeNaN();
          this.logger.info(`Assertion passed: Value is NOT NaN.`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT NaN. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeNaN assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeNull: (value: any) => {
        try {
          this.logger.info(`Asserting value NOT to be null`);
          expect(value).not.toBeNull();
          this.logger.info(`Assertion passed: Value is NOT null.`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT null. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeNull assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeTruthy: (value: any) => {
        try {
          this.logger.info(`Asserting value NOT to be truthy`);
          expect(value).not.toBeTruthy();
          this.logger.info(`Assertion passed: Value is NOT truthy.`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT truthy. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeTruthy assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toBeUndefined: (value: any) => {
        try {
          this.logger.info(`Asserting value NOT to be undefined`);
          expect(value).not.toBeUndefined();
          this.logger.info(`Assertion passed: Value is NOT undefined.`);
        } catch (error) {
          const errorMessage = `Failed to assert that value is NOT undefined. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toBeUndefined assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toContain: (value: string | Array<any> | Set<any>, expected: string | any) => {
        try {
          this.logger.info(`Asserting value NOT to contain: "${expected}"`);
          expect(value).not.toContain(expected);
          this.logger.info(`Assertion passed: Value does NOT contain "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value does NOT contain "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toContain assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toContainEqual: (value: Array<any> | Set<any>, expected: any) => {
        try {
          this.logger.info(`Asserting collection NOT to contain equal item: "${expected}"`);
          expect(value).not.toContainEqual(expected);
          this.logger.info(`Assertion passed: Collection does NOT contain equal item "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that collection does NOT contain equal item "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toContainEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toEqual: (value: any, expected: any) => {
        try {
          this.logger.info(`Asserting value NOT to equal: "${JSON.stringify(expected)}"`);
          expect(value).not.toEqual(expected);
          this.logger.info(`Assertion passed: Value does NOT equal "${JSON.stringify(expected)}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value does NOT equal "${JSON.stringify(expected)}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toHaveLength: (value: { length: number }, expected: number) => {
        try {
          this.logger.info(`Asserting value NOT to have length: "${expected}"`);
          expect(value).not.toHaveLength(expected);
          this.logger.info(`Assertion passed: Value does NOT have length "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value does NOT have length "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toHaveLength assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toHaveProperty: (value: any, keyPath: string, expected?: any) => {
        try {
          this.logger.info(`Asserting object NOT to have property: "${keyPath}"${expected !== undefined ? ` with value "${expected}"` : ''}`);
          if (expected !== undefined) {
            expect(value).not.toHaveProperty(keyPath, expected);
            this.logger.info(`Assertion passed: Object does NOT have property "${keyPath}" with value "${expected}".`);
          } else {
            expect(value).not.toHaveProperty(keyPath);
            this.logger.info(`Assertion passed: Object does NOT have property "${keyPath}".`);
          }
        } catch (error) {
          const errorMessage = `Failed to assert that object does NOT have property "${keyPath}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toHaveProperty assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toMatch: (value: string, expected: RegExp | string) => {
        try {
          this.logger.info(`Asserting string NOT to match: "${expected}"`);
          expect(value).not.toMatch(expected);
          this.logger.info(`Assertion passed: String does NOT match "${expected}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that string does NOT match "${expected}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toMatch assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toMatchObject: (value: any, expected: any) => {
        try {
          this.logger.info(`Asserting value NOT to match object: "${JSON.stringify(expected)}"`);
          expect(value).not.toMatchObject(expected);
          this.logger.info(`Assertion passed: Value does NOT match object "${JSON.stringify(expected)}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value does NOT match object "${JSON.stringify(expected)}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toMatchObject assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toStrictEqual: (value: any, expected: any) => {
        try {
          this.logger.info(`Asserting value NOT to strictly equal: "${JSON.stringify(expected)}"`);
          expect(value).not.toStrictEqual(expected);
          this.logger.info(`Assertion passed: Value does NOT strictly equal "${JSON.stringify(expected)}".`);
        } catch (error) {
          const errorMessage = `Failed to assert that value does NOT strictly equal "${JSON.stringify(expected)}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toStrictEqual assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toThrow: (fn: () => void, expected?: any) => {
        try {
          this.logger.info(`Asserting function NOT to throw${expected ? ` with expected error: "${expected}"` : ''}`);
          if (expected !== undefined) {
            expect(fn).not.toThrow(expected);
            this.logger.info(`Assertion passed: Function does NOT throw with expected error.`);
          } else {
            expect(fn).not.toThrow();
            this.logger.info(`Assertion passed: Function does NOT throw.`);
          }
        } catch (error) {
          const errorMessage = `Failed to assert that function does NOT throw. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toThrow assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },
      
      toThrowError: (fn: () => void, expected?: any) => {
        try {
          this.logger.info(`Asserting function NOT to throw error${expected ? ` with expected error: "${expected}"` : ''}`);
          if (expected !== undefined) {
            expect(fn).not.toThrowError(expected);
            this.logger.info(`Assertion passed: Function does NOT throw error with expected error.`);
          } else {
            expect(fn).not.toThrowError();
            this.logger.info(`Assertion passed: Function does NOT throw error.`);
          }
        } catch (error) {
          const errorMessage = `Failed to assert that function does NOT throw error. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
          this.logger.error(errorMessage);
          throw new Error(`not.toThrowError assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    };
  }
}
