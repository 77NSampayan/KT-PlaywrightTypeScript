import { Page, Locator, expect, test } from '@playwright/test';
import { Logger } from '@utils/logger-util';
import { ElementActions } from '@actions/element.actions';
// Import custom parameter types
import {
  ToBeVisibleOptions,
  ToBeHiddenOptions,
  ToHaveTextOptions,
  ToContainTextOptions,
  ToHaveAttributeOptions,
  ToHaveClassOptions,
  ToContainClassOptions,
  PageToHaveURLOptions,
  PageToHaveTitleOptions,
  // New Assertion Option Types
  ToBeAttachedOptions,
  ToBeCheckedOptions,
  ToBeDisabledOptions,
  ToBeEditableOptions,
  ToBeEmptyOptions,
  ToBeEnabledOptions,
  ToBeInViewportOptions,
  ToHaveAccessibleDescriptionOptions,
  ToHaveAccessibleNameOptions,
  ToHaveCSSOptions,
  ToHaveIdOptions,
  ToHaveJSPropertyOptions,
  ToHaveRoleOptions,
  ToHaveValueOptions,
  ToHaveValuesOptions,
  ARIARole,
} from '@app-types/optional-parameter.types';

/**
 * PageAssertions class provides a centralized place for all common assertions.
 * It separates assertion logic from page and element interaction logic.
 */
export class PageAssertions extends ElementActions {
  // private readonly logger: Logger;

  /**
   * @param logger - An instance of the Logger utility for consistent logging.
   */
  constructor(logger: Logger) {
    super(logger)
  }

  // --- Element Assertions ---

  /**
   * Asserts that an element is visible.
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional assertion parameters.
   */
  async expectToBeVisible(locator: Locator, options?: ToBeVisibleOptions): Promise<void> {
    try {
      this.logger.info(`Asserting element "${locator}" to be visible.`);
      await expect(locator).toBeVisible(options);
      this.logger.info(`Assertion passed: Element "${locator}" is visible.`);
    } catch (error) {
      const errorMessage = `Failed to assert that element "${locator}" is visible. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectToBeVisible assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements are visible.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeVisible(locators: Locator[], options?: ToBeVisibleOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be visible.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be visible.`);
        await expect(locator).toBeVisible(options);
        this.logger.info(`Assertion passed: Element "${locator}" is visible.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are visible.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are visible. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeVisible assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Soft-asserts that an element is visible. Unlike expectToBeVisible, a failure is
   * recorded on the test but does not throw — remaining steps and assertions still run,
   * and the test is marked failed only once it finishes. Use for non-critical UI checks
   * where you want to keep collecting evidence (e.g. multiple form fields) instead of
   * aborting on the first mismatch.
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional assertion parameters.
   */
  async expectSoftToBeVisible(locator: Locator, options?: ToBeVisibleOptions): Promise<void> {
    const errorCountBefore = test.info().errors.length;
    this.logger.info(`Soft-asserting element "${locator}" to be visible.`);
    await expect.soft(locator).toBeVisible(options);
    if (test.info().errors.length > errorCountBefore) {
      this.logger.warn(`Soft assertion failed: element "${locator}" is not visible. Test will continue and fail at the end.`);
    } else {
      this.logger.info(`Soft assertion passed: Element "${locator}" is visible.`);
    }
  }

  /**
   * Soft-asserts that all specified elements are visible, without stopping on the first
   * failure. Every locator in the list is checked even if an earlier one failed.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllSoftToBeVisible(locators: Locator[], options?: ToBeVisibleOptions): Promise<void> {
    this.logger.info(`Soft-asserting ${locators.length} elements to be visible.`);
    for (const locator of locators) {
      await this.expectSoftToBeVisible(locator, options);
    }
    this.logger.info(`Completed soft visibility assertions for ${locators.length} elements. Check test results for any failures.`);
  }

  /**
   * Asserts that all specified elements are hidden.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeHidden(locators: Locator[], options?: ToBeHiddenOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be hidden.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be hidden.`);
        await expect(locator).toBeHidden(options);
        this.logger.info(`Assertion passed: Element "${locator}" is hidden.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are hidden.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are hidden. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeHidden assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements have the specified text.
   * Can operate in two modes:
   * 1. If a single text/RegExp is provided, asserts all locators have this text.
   * 2. If an array of texts/RegExp is provided, asserts each locator has its corresponding text.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param texts - The expected text/RegExp, or an array of expected texts/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveText(locators: Locator[], texts: string | RegExp | Array<string | RegExp>, options?: ToHaveTextOptions): Promise<void> {
    try {
      if (Array.isArray(texts)) {
        // Mode 2: Array of texts
        if (locators.length !== texts.length) {
          throw new Error(`The number of locators (${locators.length}) and texts (${texts.length}) must be the same when an array of texts is provided.`);
        }
        this.logger.info(`Asserting ${locators.length} elements to have their respective texts from an array.`);
        for (let i = 0; i < locators.length; i++) {
          const locator = locators[i];
          const text = texts[i];
          this.logger.info(`Asserting element "${locator}" to have text: "${text}"`);
          await this.waitForElementState(locator, { state: 'visible', timeout: 1000 * 10 });
          await expect(locator).toHaveText(text, options);
          this.logger.info(`Assertion passed: Element "${locator}" has text "${text}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements have their respective texts.`);
      } else {
        // Mode 1: Single text for all locators
        this.logger.info(`Asserting ${locators.length} elements to have text: "${texts}"`);
        for (const locator of locators) {
          this.logger.info(`Asserting element "${locator}" to have text: "${texts}"`);
          await this.waitForElementState(locator, { state: 'visible', timeout: 1000 * 10 });
          await expect(locator).toHaveText(texts, options);
          this.logger.info(`Assertion passed: Element "${locator}" has text "${texts}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements have text "${texts}".`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that all elements have the specified text. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToHaveText assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements contain the specified text.
   * Can operate in two modes:
   * 1. If a single text/RegExp is provided, asserts all locators contain this text.
   * 2. If an array of texts/RegExp is provided, asserts each locator contains its corresponding text.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param texts - The expected text/RegExp, or an array of expected texts/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToContainText(locators: Locator[], texts: string | RegExp | (string | RegExp)[], options?: ToContainTextOptions): Promise<void> {
    try {
      if (Array.isArray(texts)) {
        // Mode 2: Array of texts
        if (locators.length !== texts.length) {
          throw new Error(`The number of locators (${locators.length}) and texts (${texts.length}) must be the same when an array of texts is provided.`);
        }
        this.logger.info(`Asserting ${locators.length} elements to contain their respective texts from an array.`);
        for (let i = 0; i < locators.length; i++) {
          const locator = locators[i];
          const text = texts[i];
          this.logger.info(`Asserting element "${locator}" to contain text "${text}"`);
          await this.waitForElementState(locator, { state: 'visible', timeout: 1000 * 10 });
          await expect(locator).toContainText(text, options);
          this.logger.info(`Assertion passed: Element "${locator}" contains text "${text}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements contain their respective texts.`);
      } else {
        // Mode 1: Single text for all locators
        this.logger.info(`Asserting ${locators.length} elements to contain text: "${texts}"`);
        for (const locator of locators) {
          this.logger.info(`Asserting element "${locator}" to contain text: "${texts}"`);
          await this.waitForElementState(locator, { state: 'visible', timeout: 1000 * 10 });
          await expect(locator).toContainText(texts, options);
          this.logger.info(`Assertion passed: Element "${locator}" contains text "${texts}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements contain text "${texts}".`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that all elements contain their respective texts. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToContainText assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements do NOT contain the specified text.
   * Can operate in two modes:
   * 1. If a single text/RegExp is provided, asserts all locators do NOT contain this text.
   * 2. If an array of texts/RegExp is provided, asserts each locator does NOT contain its corresponding text.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param texts - The text/RegExp that should NOT be contained, or an array of texts/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToNotContainText(locators: Locator[], texts: string | RegExp | (string | RegExp)[], options?: ToContainTextOptions): Promise<void> {
    try {
      if (Array.isArray(texts)) {
        // Mode 2: Array of texts
        if (locators.length !== texts.length) {
          throw new Error(`The number of locators (${locators.length}) and texts (${texts.length}) must be the same when an array of texts is provided.`);
        }
        this.logger.info(`Asserting ${locators.length} elements to NOT contain their respective texts from an array.`);
        for (let i = 0; i < locators.length; i++) {
          const locator = locators[i];
          const text = texts[i];
          this.logger.info(`Asserting element "${locator}" to NOT contain text "${text}"`);
          // await this.waitForElementState(locator, { state: 'visible', timeout: 1000 * 10 });
          await expect(locator).not.toContainText(text, options);
          this.logger.info(`Assertion passed: Element "${locator}" does NOT contain text "${text}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements do NOT contain their respective texts.`);
      } else {
        // Mode 1: Single text for all locators
        this.logger.info(`Asserting ${locators.length} elements to NOT contain text: "${texts}"`);
        for (const locator of locators) {
          this.logger.info(`Asserting element "${locator}" to NOT contain text: "${texts}"`);
          // await this.waitForElementState(locator, { state: 'visible', timeout: 1000 * 10 });
          await expect(locator).not.toContainText(texts, options);
          this.logger.info(`Assertion passed: Element "${locator}" does NOT contain text "${texts}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements do NOT contain text "${texts}".`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that all elements do NOT contain their respective texts. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToNotContainText assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements have a specific attribute with a given value.
   * Can operate in two modes:
   * 1. If a single value/RegExp is provided, asserts all locators have attribute with this value.
   * 2. If an array of values/RegExp is provided, asserts each locator has attribute with its corresponding value.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param attributeName - The name of the attribute.
   * @param value - The expected value/RegExp, or an array of expected values/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveAttribute(locators: Locator[], attributeName: string, value: string | RegExp | Array<string | RegExp>, options?: ToHaveAttributeOptions): Promise<void> {
    try {
      if (Array.isArray(value)) {
        // Mode 2: Array of values
        if (locators.length !== value.length) {
          throw new Error(`The number of locators (${locators.length}) and values (${value.length}) must be the same when an array of values is provided.`);
        }
        this.logger.info(`Asserting ${locators.length} elements to have attribute "${attributeName}" with their respective values from an array.`);
        for (let i = 0; i < locators.length; i++) {
          const locator = locators[i];
          const currentValue = value[i];
          this.logger.info(`Asserting element "${locator}" to have attribute "${attributeName}" with value "${currentValue}"`);
          await expect(locator).toHaveAttribute(attributeName, currentValue, options);
          this.logger.info(`Assertion passed: Element "${locator}" has attribute "${attributeName}" with value "${currentValue}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements have attribute "${attributeName}" with their respective values.`);
      } else {
        // Mode 1: Single value for all locators
        this.logger.info(`Asserting ${locators.length} elements to have attribute "${attributeName}" with value "${value}"`);
        for (const locator of locators) {
          this.logger.info(`Asserting element "${locator}" to have attribute "${attributeName}" with value "${value}"`);
          await expect(locator).toHaveAttribute(attributeName, value, options);
          this.logger.info(`Assertion passed: Element "${locator}" has attribute "${attributeName}" with value "${value}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements have attribute "${attributeName}" with value "${value}".`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that all elements have attribute "${attributeName}" with the specified value. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToHaveAttribute assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements have a specific CSS class.
   * Can operate in two modes:
   * 1. If a single class string is provided, asserts all locators have this class.
   * 2. If an array of class strings is provided, asserts each locator has its corresponding class.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param className - The expected CSS class string, or an array of expected CSS class strings corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveClass(locators: Locator[], className: string | string[], options?: ToHaveClassOptions): Promise<void> {
    try {
      if (Array.isArray(className)) {
        // Mode 2: Array of class names
        if (locators.length !== className.length) {
          throw new Error(`The number of locators (${locators.length}) and class names (${className.length}) must be the same when an array of class names is provided.`);
        }
        this.logger.info(`Asserting ${locators.length} elements to have their respective CSS classes from an array.`);
        for (let i = 0; i < locators.length; i++) {
          const locator = locators[i];
          const currentClassName = className[i];
          this.logger.info(`Asserting element "${locator}" to have CSS class: "${currentClassName}"`);
          await expect(locator).toHaveClass(currentClassName, options);
          this.logger.info(`Assertion passed: Element "${locator}" has CSS class "${currentClassName}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements have their respective CSS classes.`);
      } else {
        // Mode 1: Single class name for all locators
        this.logger.info(`Asserting ${locators.length} elements to have CSS class: "${className}"`);
        for (const locator of locators) {
          this.logger.info(`Asserting element "${locator}" to have CSS class: "${className}"`);
          await expect(locator).toHaveClass(className, options);
          this.logger.info(`Assertion passed: Element "${locator}" has CSS class "${className}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements have CSS class "${className}".`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that all elements have CSS class "${className}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToHaveClass assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // --- New Element Assertions ---

  /**
   * Asserts that all specified elements are attached to the DOM.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeAttached(locators: Locator[], options?: ToBeAttachedOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be attached.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be attached.`);
        await expect(locator).toBeAttached(options);
        this.logger.info(`Assertion passed: Element "${locator}" is attached.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are attached.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are attached. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeAttached assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified checkboxes or radio buttons are checked.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeChecked(locators: Locator[], options?: ToBeCheckedOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be checked.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be checked.`);
        await expect(locator).toBeChecked(options);
        this.logger.info(`Assertion passed: Element "${locator}" is checked.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are checked.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are checked. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeChecked assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements are disabled.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeDisabled(locators: Locator[], options?: ToBeDisabledOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be disabled.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be disabled.`);
        await expect(locator).toBeDisabled(options);
        this.logger.info(`Assertion passed: Element "${locator}" is disabled.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are disabled.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are disabled. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeDisabled assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements are editable.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeEditable(locators: Locator[], options?: ToBeEditableOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be editable.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be editable.`);
        await expect(locator).toBeEditable(options);
        this.logger.info(`Assertion passed: Element "${locator}" is editable.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are editable.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are editable. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeEditable assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements are empty.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeEmpty(locators: Locator[], options?: ToBeEmptyOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be empty.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be empty.`);
        await expect(locator).toBeEmpty(options);
        this.logger.info(`Assertion passed: Element "${locator}" is empty.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are empty.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are empty. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeEmpty assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements are enabled.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeEnabled(locators: Locator[], options?: ToBeEnabledOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be enabled.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be enabled.`);
        await expect(locator).toBeEnabled(options);
        this.logger.info(`Assertion passed: Element "${locator}" is enabled.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are enabled.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are enabled. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeEnabled assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements intersect the viewport.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param options - Optional assertion parameters.
   */
  async expectAllToBeInViewport(locators: Locator[], options?: ToBeInViewportOptions): Promise<void> {
    try {
      this.logger.info(`Asserting ${locators.length} elements to be in viewport.`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to be in viewport.`);
        await expect(locator).toBeInViewport(options);
        this.logger.info(`Assertion passed: Element "${locator}" is in viewport.`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements are in viewport.`);
    } catch (error) {
      const errorMessage = `Failed to assert that all elements are in viewport. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToBeInViewport assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements contain the specified CSS classes.
   * Can operate in two modes:
   * 1. If a single class string or string[] is provided, asserts all locators contain these classes.
   * 2. If an array of class strings or string[] is provided, asserts each locator contains its corresponding classes.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param classNames - The expected CSS classes (string or string[]), or an array of expected CSS classes (string or string[]) corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToContainClass(locators: Locator[], classNames: string | string[] | Array<string | string[]>, options?: ToContainClassOptions): Promise<void> {
    try {
      if (Array.isArray(classNames)) {
        // Mode 2: Array of class names/arrays for each locator
        if (locators.length !== classNames.length) {
          throw new Error(`The number of locators (${locators.length}) and class names arrays (${classNames.length}) must be the same when an array of class names is provided.`);
        }
        this.logger.info(`Asserting ${locators.length} elements to contain their respective CSS classes from an array.`);
        for (let i = 0; i < locators.length; i++) {
          const locator = locators[i];
          const currentClassNames = classNames[i];
          this.logger.info(`Asserting element "${locator}" to contain CSS classes: "${currentClassNames}"`);
          await expect(locator).toContainClass(currentClassNames, options);
          this.logger.info(`Assertion passed: Element "${locator}" contains CSS classes "${currentClassNames}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements contain their respective CSS classes.`);
      } else {
        // Mode 1: Single set of class names for all locators
        this.logger.info(`Asserting ${locators.length} elements to contain CSS classes: "${classNames}"`);
        for (const locator of locators) {
          this.logger.info(`Asserting element "${locator}" to contain CSS classes: "${classNames}"`);
          await expect(locator).toContainClass(classNames, options);
          this.logger.info(`Assertion passed: Element "${locator}" contains CSS classes "${classNames}".`);
        }
        this.logger.info(`Assertion passed: All ${locators.length} elements contain CSS classes "${classNames}".`);
      }
    } catch (error) {
      const errorMessage = `Failed to assert that all elements contain CSS classes. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectAllToContainClass assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that all specified elements have a matching accessible description.
   * Can operate in two modes:
   * 1. If a single description/RegExp is provided, asserts all locators have this accessible description.
   * 2. If an array of descriptions/RegExp is provided, asserts each locator has its corresponding accessible description.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param description - The expected accessible description string/RegExp, or an array of expected accessible descriptions/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveAccessibleDescription(locators: Locator[], description: string | RegExp | Array<string | RegExp>, options?: ToHaveAccessibleDescriptionOptions): Promise<void> {
    if (Array.isArray(description)) {
      // Mode 2: Array of descriptions
      if (locators.length !== description.length) {
        throw new Error(`The number of locators (${locators.length}) and descriptions (${description.length}) must be the same when an array of descriptions is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have their respective accessible descriptions from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentDescription = description[i];
        this.logger.info(`Asserting element "${locator}" to have accessible description: "${currentDescription}"`);
        await expect(locator).toHaveAccessibleDescription(currentDescription, options);
        this.logger.info(`Assertion passed: Element "${locator}" has accessible description "${currentDescription}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have their respective accessible descriptions.`);
    } else {
      // Mode 1: Single description for all locators
      this.logger.info(`Asserting ${locators.length} elements to have accessible description: "${description}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have accessible description: "${description}"`);
        await expect(locator).toHaveAccessibleDescription(description, options);
        this.logger.info(`Assertion passed: Element "${locator}" has accessible description "${description}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have accessible description "${description}".`);
    }
  }

  /**
   * Asserts that all specified elements have a matching accessible name.
   * Can operate in two modes:
   * 1. If a single name/RegExp is provided, asserts all locators have this accessible name.
   * 2. If an array of names/RegExp is provided, asserts each locator has its corresponding accessible name.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param name - The expected accessible name string/RegExp, or an array of expected accessible names/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveAccessibleName(locators: Locator[], name: string | RegExp | Array<string | RegExp>, options?: ToHaveAccessibleNameOptions): Promise<void> {
    if (Array.isArray(name)) {
      // Mode 2: Array of names
      if (locators.length !== name.length) {
        throw new Error(`The number of locators (${locators.length}) and names (${name.length}) must be the same when an array of names is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have their respective accessible names from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentName = name[i];
        this.logger.info(`Asserting element "${locator}" to have accessible name: "${currentName}"`);
        await expect(locator).toHaveAccessibleName(currentName, options);
        this.logger.info(`Assertion passed: Element "${locator}" has accessible name "${currentName}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have their respective accessible names.`);
    } else {
      // Mode 1: Single name for all locators
      this.logger.info(`Asserting ${locators.length} elements to have accessible name: "${name}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have accessible name: "${name}"`);
        await expect(locator).toHaveAccessibleName(name, options);
        this.logger.info(`Assertion passed: Element "${locator}" has accessible name "${name}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have accessible name "${name}".`);
    }
  }

  /**
   * Asserts that all specified elements have a specific CSS property with a given value.
   * Can operate in two modes:
   * 1. If a single value/RegExp is provided, asserts all locators have CSS property with this value.
   * 2. If an array of values/RegExp is provided, asserts each locator has CSS property with its corresponding value.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param propertyName - The name of the CSS property.
   * @param value - The expected value/RegExp, or an array of expected values/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveCSS(locators: Locator[], propertyName: string, value: string | RegExp | Array<string | RegExp>, options?: ToHaveCSSOptions): Promise<void> {
    if (Array.isArray(value)) {
      // Mode 2: Array of values
      if (locators.length !== value.length) {
        throw new Error(`The number of locators (${locators.length}) and values (${value.length}) must be the same when an array of values is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have CSS property "${propertyName}" with their respective values from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentValue = value[i];
        this.logger.info(`Asserting element "${locator}" to have CSS property "${propertyName}" with value "${currentValue}"`);
        await expect(locator).toHaveCSS(propertyName, currentValue, options);
        this.logger.info(`Assertion passed: Element "${locator}" has CSS property "${propertyName}" with value "${currentValue}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have CSS property "${propertyName}" with their respective values.`);
    } else {
      // Mode 1: Single value for all locators
      this.logger.info(`Asserting ${locators.length} elements to have CSS property "${propertyName}" with value "${value}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have CSS property "${propertyName}" with value "${value}"`);
        await expect(locator).toHaveCSS(propertyName, value, options);
        this.logger.info(`Assertion passed: Element "${locator}" has CSS property "${propertyName}" with value "${value}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have CSS property "${propertyName}" with value "${value}".`);
    }
  }

  /**
   * Asserts that all specified elements have a specific ID.
   * Can operate in two modes:
   * 1. If a single ID string is provided, asserts all locators have this ID.
   * 2. If an array of ID strings is provided, asserts each locator has its corresponding ID.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param id - The expected ID string, or an array of expected ID strings corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveId(locators: Locator[], id: string | string[], options?: ToHaveIdOptions): Promise<void> {
    if (Array.isArray(id)) {
      // Mode 2: Array of IDs
      if (locators.length !== id.length) {
        throw new Error(`The number of locators (${locators.length}) and IDs (${id.length}) must be the same when an array of IDs is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have their respective IDs from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentId = id[i];
        this.logger.info(`Asserting element "${locator}" to have ID: "${currentId}"`);
        await expect(locator).toHaveId(currentId, options);
        this.logger.info(`Assertion passed: Element "${locator}" has ID "${currentId}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have their respective IDs.`);
    } else {
      // Mode 1: Single ID for all locators
      this.logger.info(`Asserting ${locators.length} elements to have ID: "${id}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have ID: "${id}"`);
        await expect(locator).toHaveId(id, options);
        this.logger.info(`Assertion passed: Element "${locator}" has ID "${id}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have ID "${id}".`);
    }
  }

  /**
   * Asserts that all specified elements have a specific JavaScript property with a given value.
   * Can operate in two modes:
   * 1. If a single value is provided, asserts all locators have JS property with this value.
   * 2. If an array of values is provided, asserts each locator has JS property with its corresponding value.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param propertyName - The name of the JavaScript property.
   * @param value - The expected value, or an array of expected values corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveJSProperty(locators: Locator[], propertyName: string, value: any | any[], options?: ToHaveJSPropertyOptions): Promise<void> {
    if (Array.isArray(value)) {
      // Mode 2: Array of values
      if (locators.length !== value.length) {
        throw new Error(`The number of locators (${locators.length}) and values (${value.length}) must be the same when an array of values is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have JS property "${propertyName}" with their respective values from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentValue = value[i];
        this.logger.info(`Asserting element "${locator}" to have JS property "${propertyName}" with value "${currentValue}"`);
        await expect(locator).toHaveJSProperty(propertyName, currentValue, options);
        this.logger.info(`Assertion passed: Element "${locator}" has JS property "${propertyName}" with value "${currentValue}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have JS property "${propertyName}" with their respective values.`);
    } else {
      // Mode 1: Single value for all locators
      this.logger.info(`Asserting ${locators.length} elements to have JS property "${propertyName}" with value "${value}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have JS property "${propertyName}" with value "${value}"`);
        await expect(locator).toHaveJSProperty(propertyName, value, options);
        this.logger.info(`Assertion passed: Element "${locator}" has JS property "${propertyName}" with value "${value}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have JS property "${propertyName}" with value "${value}".`);
    }
  }

  /**
   * Asserts that all specified elements have a specific ARIA role.
   * Can operate in two modes:
   * 1. If a single ARIARole is provided, asserts all locators have this role.
   * 2. If an array of ARIARoles is provided, asserts each locator has its corresponding role.
   * @param locators - An array of Playwright Locator objects for the elements.
   * @param role - The expected ARIARole, or an array of expected ARIARoles corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveRole(
    locators: Locator[], 
    role: ARIARole | ARIARole[], 
    options?: ToHaveRoleOptions
  ): Promise<void> {
    if (Array.isArray(role)) {
      // Mode 2: Array of roles
      if (locators.length !== role.length) {
        throw new Error(`The number of locators (${locators.length}) and roles (${role.length}) must be the same when an array of roles is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have their respective ARIA roles from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentRole = role[i];
        this.logger.info(`Asserting element "${locator}" to have ARIA role: "${currentRole}"`);
        await expect(locator).toHaveRole(currentRole, options);
        this.logger.info(`Assertion passed: Element "${locator}" has ARIA role "${currentRole}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have their respective ARIA roles.`);
    } else {
      // Mode 1: Single role for all locators
      this.logger.info(`Asserting ${locators.length} elements to have ARIA role: "${role}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have ARIA role: "${role}"`);
        await expect(locator).toHaveRole(role, options);
        this.logger.info(`Assertion passed: Element "${locator}" has ARIA role "${role}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have ARIA role "${role}".`);
    }
  }

  /**
   * Asserts that all specified input elements have a specific value.
   * Can operate in two modes:
   * 1. If a single value/RegExp is provided, asserts all locators have this value.
   * 2. If an array of values/RegExp is provided, asserts each locator has its corresponding value.
   * @param locators - An array of Playwright Locator objects for the input elements.
   * @param value - The expected value/RegExp, or an array of expected values/RegExps corresponding to the locators.
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveValue(locators: Locator[], value: string | RegExp | Array<string | RegExp>, options?: ToHaveValueOptions): Promise<void> {
    if (Array.isArray(value)) {
      // Mode 2: Array of values
      if (locators.length !== value.length) {
        throw new Error(`The number of locators (${locators.length}) and values (${value.length}) must be the same when an array of values is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have their respective values from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentValue = value[i];
        this.logger.info(`Asserting element "${locator}" to have value: "${currentValue}"`);
        await expect(locator).toHaveValue(currentValue, options);
        this.logger.info(`Assertion passed: Element "${locator}" has value "${currentValue}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have their respective values.`);
    } else {
      // Mode 1: Single value for all locators
      this.logger.info(`Asserting ${locators.length} elements to have value: "${value}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have value: "${value}"`);
        await expect(locator).toHaveValue(value, options);
        this.logger.info(`Assertion passed: Element "${locator}" has value "${value}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have value "${value}".`);
    }
  }

  /**
   * Asserts that all specified select elements have specific options selected.
   * Can operate in two modes for string-based selections:
   * 1. If a single string or string[] is provided, asserts all locators have these selected values.
   * 2. If an array of strings or string[] is provided, asserts each locator has its corresponding selected values.
   * Note: null or Array<{ value?: string; label?: string; index?: number }> will apply to all locators.
   * @param locators - An array of Playwright Locator objects for the select elements.
   * @param values - The expected selected values (null, string, string[], array of objects, or an array of these for per-locator matching).
   * @param options - Optional assertion parameters.
   */
  async expectAllToHaveValues(locators: Locator[], values: null | string | string[] | Array<{ value?: string; label?: string; index?: number }> | Array<null | string | string[]>, options?: ToHaveValuesOptions): Promise<void> {
    // Check if 'values' is an array of items that are not objects (i.e., array of null, string, or string[])
    // This indicates the "array of values for each locator" mode.
    if (Array.isArray(values) && !values.some(item => typeof item === 'object' && item !== null && !Array.isArray(item))) {
      // Mode 2: Array of selected values for each locator
      if (locators.length !== values.length) {
        throw new Error(`The number of locators (${locators.length}) and selected values array (${values.length}) must be the same when an array of selected values is provided.`);
      }
      this.logger.info(`Asserting ${locators.length} elements to have their respective selected values from an array.`);
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const currentValues = values[i];
        const currentValuesString = currentValues === null ? 'null (no selection)' : JSON.stringify(currentValues);
        this.logger.info(`Asserting element "${locator}" to have selected values: "${currentValuesString}"`);
        await expect(locator).toHaveValues(currentValues as any, options);
        this.logger.info(`Assertion passed: Element "${locator}" has selected values "${currentValuesString}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have their respective selected values.`);
    } else {
      // Mode 1: Single set of selected values for all locators
      const valuesString = values === null ? 'null (no selection)' : JSON.stringify(values);
      this.logger.info(`Asserting ${locators.length} elements to have selected values: "${valuesString}"`);
      for (const locator of locators) {
        this.logger.info(`Asserting element "${locator}" to have selected values: "${valuesString}"`);
        await expect(locator).toHaveValues(values as any, options);
        this.logger.info(`Assertion passed: Element "${locator}" has selected values "${valuesString}".`);
      }
      this.logger.info(`Assertion passed: All ${locators.length} elements have selected values "${valuesString}".`);
    }
  }

  // --- Page Assertions ---

  /**
   * Asserts that the page URL matches the given pattern.
   * @param page - The Playwright Page object.
   * @param urlPattern - The expected URL or a regular expression.
   * @param options - Optional assertion parameters.
   */
  async expectToHaveURL(page: Page, urlPattern: string | RegExp, options?: PageToHaveURLOptions): Promise<void> {
    try {
      this.logger.info(`Asserting page URL to be: "${urlPattern}"`);
      await expect(page).toHaveURL(urlPattern, options);
      this.logger.info(`Assertion passed: Page URL is "${page.url()}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that page URL is "${urlPattern}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectToHaveURL assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Asserts that the page title matches the given pattern.
   * @param page - The Playwright Page object.
   * @param titlePattern - The expected title or a regular expression.
   * @param options - Optional assertion parameters.
   */
  async expectToHaveTitle(page: Page, titlePattern: string | RegExp, options?: PageToHaveTitleOptions): Promise<void> {
    try {
      this.logger.info(`Asserting page title to be: "${titlePattern}"`);
      await expect(page).toHaveTitle(titlePattern, options);
      this.logger.info(`Assertion passed: Page title is "${await page.title()}".`);
    } catch (error) {
      const errorMessage = `Failed to assert that page title is "${titlePattern}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`expectToHaveTitle assertion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
