import { Locator, expect } from '@playwright/test';
import { Logger } from '@utils/logger-util';
// Import custom parameter types
import {
  ClickOptions,
  FillOptions,
  ClearOptions,
  CheckOptions,
  UncheckOptions,
  SelectOptionOptions,
  HoverOptions,
  FocusOptions,
  DragToOptions,
  WaitForOptions,
  TextContentOptions,
  GetAttributeOptions,
  InputValueOptions,
} from '@app-types/optional-parameter.types';

/**
 * ElementActions class provides a centralized place for all element-specific interactions.
 * It promotes code reuse and separates element interaction logic from page-level logic.
 */
export class ElementActions {
  public readonly logger: Logger;

  /**
   * @param logger - An instance of the Logger utility for consistent logging.
   */
  constructor(logger: Logger) {
    this.logger = logger;
  }

  // --- Interaction Actions ---

  /**
   * Clicks on an element.
   * @param locator - The Playwright Locator object for the element to click.
   * @param options - Optional click parameters.
   */
  async click(locator: Locator, options?: ClickOptions): Promise<void> {
    this.logger.info(`Clicking on element with selector: "${locator}"`);
    try {
      // Playwright's click action automatically waits for the element to be visible, stable, and enabled
      await locator.click(options);
      this.logger.info(`Successfully clicked on element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to click on element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Click action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clicks on multiple elements.
   * @param locators - An array of Playwright Locator objects for the elements to click.
   * @param options - Optional click parameters.
   */
  async clickAll(locators: Locator[], options?: ClickOptions): Promise<void> {
    this.logger.info(`Clicking on ${locators.length} elements.`);
    try {
      for (const locator of locators) {
        this.logger.info(`Clicking on element with selector: "${locator}"`);
        await locator.click(options);
        this.logger.info(`Successfully clicked on element: "${locator}"`);
      }
      this.logger.info(`Successfully clicked on all ${locators.length} elements.`);
    } catch (error) {
      const errorMessage = `Failed to click on all elements. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`ClickAll action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fills an input field with the given value.
   * @param locator - The Playwright Locator object for the input field.
   * @param value - The value to fill into the input field.
   * @param options - Optional fill parameters.
   */
  async fill(locator: Locator, value: string, options?: FillOptions): Promise<void> {
    this.logger.info(`Filling element "${locator}" with value: "${value}"`);
    try {
      // Playwright's fill action automatically waits for the element to be visible, stable, and enabled
      await locator.fill(value, options);
      this.logger.info(`Successfully filled element "${locator}" with value: "${value}"`);
    } catch (error) {
      const errorMessage = `Failed to fill element "${locator}" with value: "${value}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Fill action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fills multiple input fields with the given corresponding values.
   * @param locators - An array of Playwright Locator objects for the input fields.
   * @param values - An array of values to fill into the corresponding input fields.
   * @param options - Optional fill parameters.
   */
  async fillAll(locators: Locator[], values: string[], options?: FillOptions): Promise<void> {
    if (locators.length !== values.length) {
      throw new Error(`The number of locators (${locators.length}) and values (${values.length}) must be the same.`);
    }
    this.logger.info(`Filling ${locators.length} elements with respective values.`);
    try {
      for (let i = 0; i < locators.length; i++) {
        const locator = locators[i];
        const value = values[i];
        this.logger.info(`Filling element "${locator}" with value: "${value}"`);
        await locator.fill(value, options);
        this.logger.info(`Successfully filled element "${locator}" with value: "${value}"`);
      }
      this.logger.info(`Successfully filled all ${locators.length} elements with their respective values.`);
    } catch (error) {
      const errorMessage = `Failed to fill all elements. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`FillAll action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clears the content of an input field.
   * @param locator - The Playwright Locator object for the input field.
   * @param options - Optional clear parameters.
   */
  async clear(locator: Locator, options?: ClearOptions): Promise<void> {
    this.logger.info(`Clearing element with selector: "${locator}"`);
    try {
      await locator.clear(options);
      this.logger.info(`Successfully cleared element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to clear element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Clear action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Clears the content of multiple input fields.
   * @param locators - An array of Playwright Locator objects for the input fields.
   * @param options - Optional clear parameters.
   */
  async clearAll(locators: Locator[], options?: ClearOptions): Promise<void> {
    this.logger.info(`Clearing ${locators.length} elements.`);
    try {
      for (const locator of locators) {
        this.logger.info(`Clearing element with selector: "${locator}"`);
        await locator.clear(options);
        this.logger.info(`Successfully cleared element: "${locator}"`);
      }
      this.logger.info(`Successfully cleared all ${locators.length} elements.`);
    } catch (error) {
      const errorMessage = `Failed to clear all elements. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`ClearAll action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks a checkbox or radio button.
   * @param locator - The Playwright Locator object for the checkbox/radio button.
   * @param options - Optional check parameters.
   */
  async check(locator: Locator, options?: CheckOptions): Promise<void> {
    this.logger.info(`Checking element with selector: "${locator}"`);
    try {
      // Playwright's check action automatically waits for the element to be visible, stable, and enabled
      await locator.check(options);
      this.logger.info(`Successfully checked element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to check element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Check action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Checks multiple checkboxes or radio buttons.
   * @param locators - An array of Playwright Locator objects for the checkboxes/radio buttons.
   * @param options - Optional check parameters.
   */
  async checkAll(locators: Locator[], options?: CheckOptions): Promise<void> {
    this.logger.info(`Checking ${locators.length} elements.`);
    try {
      for (const locator of locators) {
        this.logger.info(`Checking element with selector: "${locator}"`);
        await locator.check(options);
        this.logger.info(`Successfully checked element: "${locator}"`);
      }
      this.logger.info(`Successfully checked all ${locators.length} elements.`);
    } catch (error) {
      const errorMessage = `Failed to check all elements. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`CheckAll action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Unchecks a checkbox.
   * @param locator - The Playwright Locator object for the checkbox.
   * @param options - Optional uncheck parameters.
   */
  async uncheck(locator: Locator, options?: UncheckOptions): Promise<void> {
    this.logger.info(`Unchecking element with selector: "${locator}"`);
    try {
      // Playwright's uncheck action automatically waits for the element to be visible, stable, and enabled
      await locator.uncheck(options);
      this.logger.info(`Successfully unchecked element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to uncheck element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Uncheck action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Unchecks multiple checkboxes.
   * @param locators - An array of Playwright Locator objects for the checkboxes.
   * @param options - Optional uncheck parameters.
   */
  async uncheckAll(locators: Locator[], options?: UncheckOptions): Promise<void> {
    this.logger.info(`Unchecking ${locators.length} elements.`);
    try {
      for (const locator of locators) {
        this.logger.info(`Unchecking element with selector: "${locator}"`);
        await locator.uncheck(options);
        this.logger.info(`Successfully unchecked element: "${locator}"`);
      }
      this.logger.info(`Successfully unchecked all ${locators.length} elements.`);
    } catch (error) {
      const errorMessage = `Failed to uncheck all elements. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`UncheckAll action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Selects an option in a dropdown by its value, label, or index.
   * @param locator - The Playwright Locator object for the select element.
   * @param value - The value, label, or index of the option to select.
   * @param options - Optional select parameters.
   */
  async selectOption(locator: Locator, value: string | { value?: string; label?: string; index?: number }, options?: SelectOptionOptions): Promise<void> {
    this.logger.info(`Selecting option in element "${locator}" with value/label/index: ${JSON.stringify(value)}`);
    try {
      // Playwright's selectOption action automatically waits for the element to be visible, stable, and enabled
      await locator.selectOption(value, options);
      this.logger.info(`Successfully selected option in element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to select option in element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`SelectOption action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Selects multiple options in a single dropdown element.
   * Useful for multi-select dropdowns.
   * @param locator - The Playwright Locator object for the select element.
   * @param values - An array of option objects, where each object can specify a value, label, or index.
   * @param options - Optional select parameters.
   */
  async selectOptions(locator: Locator, values: Array<{ value?: string; label?: string; index?: number }>, options?: SelectOptionOptions): Promise<void> {
    this.logger.info(`Selecting multiple options in element "${locator}" with option objects: ${JSON.stringify(values)}`);
    try {
      await locator.selectOption(values, options);
      this.logger.info(`Successfully selected multiple options in element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to select multiple options in element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`SelectOptions action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Hovers over an element.
   * @param locator - The Playwright Locator object for the element to hover over.
   * @param options - Optional hover parameters.
   */
  async hover(locator: Locator, options?: HoverOptions): Promise<void> {
    this.logger.info(`Hovering over element with selector: "${locator}"`);
    try {
      // Playwright's hover action automatically waits for the element to be visible and stable
      await locator.hover(options);
      this.logger.info(`Successfully hovered over element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to hover over element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Hover action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Focuses on an element.
   * @param locator - The Playwright Locator object for the element to focus.
   * @param options - Optional focus parameters.
   */
  async focus(locator: Locator, options?: FocusOptions): Promise<void> {
    this.logger.info(`Focusing on element with selector: "${locator}"`);
    try {
      // Playwright's focus action automatically waits for the element to be visible, stable, and enables it
      await locator.focus(options);
      this.logger.info(`Successfully focused on element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to focus on element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Focus action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Drags the source element and drops it on the target element.
   * @param sourceLocator - The Playwright Locator object for the element to drag.
   * @param targetLocator - The Playwright Locator object for the element to drop on.
   * @param options - Optional drag and drop parameters.
   */
  async dragAndDrop(sourceLocator: Locator, targetLocator: Locator, options?: DragToOptions): Promise<void> {
    this.logger.info(`Dragging element "${sourceLocator}" and dropping on element "${targetLocator}"`);
    try {
      // Playwright's dragTo action automatically waits for the source element to be visible, stable, and enabled, and for the target element to be visible and stable
      await sourceLocator.dragTo(targetLocator, options);
      this.logger.info(`Successfully dragged and dropped element "${sourceLocator}" to "${targetLocator}"`);
    } catch (error) {
      const errorMessage = `Failed to drag element "${sourceLocator}" to "${targetLocator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`DragAndDrop action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // --- Value Getters ---

  /**
   * Gets the text content of an element.
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional parameters for getting text content.
   * @returns The text content of the element, or null if not found.
   */
  async getTextContent(locator: Locator, options?: TextContentOptions): Promise<string | null> {
    this.logger.info(`Getting text content of element: "${locator}"`);
    try {
      const textContent = await locator.textContent(options);
      this.logger.info(`Text content of element "${locator}" is: "${textContent}"`);
      return textContent;
    } catch (error) {
      const errorMessage = `Failed to get text content of element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`GetTextContent action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the value of an attribute of an element.
   * @param locator - The Playwright Locator object for the element.
   * @param attributeName - The name of the attribute.
   * @param options - Optional parameters for getting attribute value.
   * @returns The value of the attribute, or null if not found.
   */
  async getAttribute(locator: Locator, attributeName: string, options?: GetAttributeOptions): Promise<string | null> {
    this.logger.info(`Getting attribute "${attributeName}" of element: "${locator}"`);
    try {
      const attributeValue = await locator.getAttribute(attributeName, options);
      this.logger.info(`Attribute "${attributeName}" of element "${locator}" is: "${attributeValue}"`);
      return attributeValue;
    } catch (error) {
      const errorMessage = `Failed to get attribute "${attributeName}" of element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`GetAttribute action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the input value of an element (e.g., input, textarea, select).
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional parameters for getting input value.
   * @returns The input value of the element.
   */
  async getInputValue(locator: Locator, options?: InputValueOptions): Promise<string> {
    this.logger.info(`Getting input value of element: "${locator}"`);
    try {
      const inputValue = await locator.inputValue(options);
      this.logger.info(`Input value of element "${locator}" is: "${inputValue}"`);
      return inputValue;
    } catch (error) {
      const errorMessage = `Failed to get input value of element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`GetInputValue action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // --- Additional Advanced Interaction Methods ---

  /**
   * Double clicks on an element.
   * @param locator - The Playwright Locator object for the element to double click.
   * @param options - Optional click parameters.
   */
  async doubleClick(locator: Locator, options?: ClickOptions): Promise<void> {
    this.logger.info(`Double clicking on element with selector: "${locator}"`);
    try {
      // Playwright's double click action automatically waits for the element to be visible, stable, and enabled
      await locator.dblclick(options);
      this.logger.info(`Successfully double clicked on element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to double click on element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`DoubleClick action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Right clicks on an element (context menu).
   * @param locator - The Playwright Locator object for the element to right click.
   * @param options - Optional click parameters.
   */
  async rightClick(locator: Locator, options?: ClickOptions): Promise<void> {
    this.logger.info(`Right clicking on element with selector: "${locator}"`);
    try {
      await locator.click({ button: 'right', ...options });
      this.logger.info(`Successfully right clicked on element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to right click on element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`RightClick action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Types text character by character on an element.
   * @param locator - The Playwright Locator object for the element.
   * @param text - The text to type.
   * @param options - Optional typing parameters.
   */
  async type(locator: Locator, text: string, options?: { delay?: number }): Promise<void> {
    this.logger.info(`Typing text "${text}" on element: "${locator}"`);
    try {
      // Playwright's type action automatically waits for the element to be visible, stable, and enabled
      await locator.type(text, options);
      this.logger.info(`Successfully typed text on element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to type text "${text}" on element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Type action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Presses a key on an element.
   * @param locator - The Playwright Locator object for the element.
   * @param key - The key to press.
   * @param options - Optional press parameters.
   */
  async press(locator: Locator, key: string, options?: { delay?: number }): Promise<void> {
    this.logger.info(`Pressing key "${key}" on element: "${locator}"`);
    try {
      // Playwright's press action automatically waits for the element to be visible, stable, and enabled
      await locator.press(key, options);
      this.logger.info(`Successfully pressed key on element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to press key "${key}" on element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Press action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Removes focus from an element.
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional blur parameters.
   */
  async blur(locator: Locator): Promise<void> {
    this.logger.info(`Blurring element with selector: "${locator}"`);
    try {
      await locator.blur();
      this.logger.info(`Successfully blurred element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to blur element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Blur action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Scrolls the page or element to a specific position.
   * @param locator - The Playwright Locator object for the element to scroll.
   * @param options - Scroll options.
   */
  async scrollTo(locator: Locator, options?: { top?: number; left?: number }): Promise<void> {
    this.logger.info(`Scrolling element: "${locator}"`);
    try {
      await locator.evaluate((el, opts) => {
        if (opts && opts.top !== undefined) el.scrollTop = opts.top;
        if (opts && opts.left !== undefined) el.scrollLeft = opts.left;
      }, options);
      this.logger.info(`Successfully scrolled element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to scroll element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`ScrollTo action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Scrolls an element into view.
   * @param locator - The Playwright Locator object for the element to scroll into view.
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    this.logger.info(`Scrolling element into view: "${locator}"`);
    try {
      await locator.scrollIntoViewIfNeeded();
      this.logger.info(`Successfully scrolled element into view: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to scroll element into view: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`ScrollIntoView action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Uploads files to an input element.
   * @param locator - The Playwright Locator object for the file input element.
   * @param filePaths - Array of file paths to upload.
   * @param options - Optional upload parameters.
   */
  async uploadFile(locator: Locator, filePaths: string[], options?: { timeout?: number }): Promise<void> {
    this.logger.info(`Uploading files to element: "${locator}"`);
    try {
      await locator.setInputFiles(filePaths, options);
      this.logger.info(`Successfully uploaded files to element: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to upload files to element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`UploadFile action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // --- Wait Actions ---

  /**
   * Waits for an element to be visible.
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional wait parameters.
   */
  async waitForElementState(locator: Locator, options?: WaitForOptions): Promise<void> {
    this.logger.info(`Waiting for element to be visible: "${locator}"`);
    try {
      await locator.waitFor(options);
      this.logger.info(`Element is now visible: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to wait for element to be visible: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`WaitForElementState action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Waits for an element to be hidden.
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional wait parameters.
   */
  async waitForVisible(locator: Locator, options?: WaitForOptions): Promise<void> {
    this.logger.info(`Waiting for element to be visible: "${locator}"`);
    try {
      await locator.waitFor({ state: 'visible', ...options });
      this.logger.info(`Element is now visible: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to wait for element to be visible: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`WaitForVisible action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Waits for an element to be enabled.
   * @param locator - The Playwright Locator object for the element.
   * @param options - Optional wait parameters.
   */
  async waitForEnabled(locator: Locator, options?: WaitForOptions): Promise<void> {
    this.logger.info(`Waiting for element to be enabled: "${locator}"`);
    try {
      await locator.waitFor({ state: 'visible', ...options });
      // Additional check for enabled state
      await expect(locator).toBeEnabled();
      this.logger.info(`Element is now enabled: "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to wait for element to be enabled: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`WaitForEnabled action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Waits for an element to contain specific text.
   * @param locator - The Playwright Locator object for the element.
   * @param text - The text to wait for.
   * @param options - Optional wait parameters.
   */
  async waitForText(locator: Locator, text: string, options?: WaitForOptions): Promise<void> {
    this.logger.info(`Waiting for element to contain text "${text}": "${locator}"`);
    try {
      await locator.waitFor({ state: 'visible', ...options });
      await expect(locator).toContainText(text);
      this.logger.info(`Element now contains text "${text}": "${locator}"`);
    } catch (error) {
      const errorMessage = `Failed to wait for element to contain text "${text}": "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`WaitForText action failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // --- Element State Check Methods ---

  /**
   * Checks if an element is checked (for checkboxes or radio buttons) within a specified timeout period.
   * @param locator - The Playwright Locator object for the element.
   * @param timeout - The maximum time to wait for the element to be checked (in seconds). Default is 30 seconds.
   * @returns A promise that resolves to true if the element is checked within the timeout, false otherwise.
   */
  async isChecked(locator: Locator, timeout: number): Promise<boolean> {
    this.logger.info(`Checking if element is checked within ${timeout} seconds: "${locator}"`);
    try {
      await locator.waitFor({ state: 'attached', timeout: timeout});
      const isChecked = await locator.isChecked();
      this.logger.info(`Element "${locator}" is ${isChecked ? 'checked' : 'not checked'}`);
      return isChecked;
    } catch (error) {
      this.logger.info(`Element "${locator}" was not found or is not checked within ${timeout} seconds`);
      return false;
    }
  }

  /**
   * Checks if an element is disabled within a specified timeout period.
   * @param locator - The Playwright Locator object for the element.
   * @param timeout - The maximum time to wait for the element to be disabled (in seconds). Default is 30 seconds.
   * @returns A promise that resolves to true if the element is disabled within the timeout, false otherwise.
   */
  async isDisabled(locator: Locator, timeout: number): Promise<boolean> {
    this.logger.info(`Checking if element is disabled within ${timeout} seconds: "${locator}"`);
    try {
      await locator.waitFor({ state: 'attached', timeout: timeout });
      const isDisabled = await locator.isDisabled();
      this.logger.info(`Element "${locator}" is ${isDisabled ? 'disabled' : 'enabled'}`);
      return isDisabled;
    } catch (error) {
      this.logger.info(`Element "${locator}" was not found or is not disabled within ${timeout} seconds`);
      return false;
    }
  }

  /**
   * Checks if an element is editable (input fields, textareas, etc.) within a specified timeout period.
   * @param locator - The Playwright Locator object for the element.
   * @param timeout - The maximum time to wait for the element to be editable (in seconds). Default is 30 seconds.
   * @returns A promise that resolves to true if the element is editable within the timeout, false otherwise.
   */
  async isEditable(locator: Locator, timeout: number): Promise<boolean> {
    this.logger.info(`Checking if element is editable within ${timeout} seconds: "${locator}"`);
    try {
      await locator.waitFor({ state: 'attached', timeout: timeout });
      const isEditable = await locator.isEditable();
      this.logger.info(`Element "${locator}" is ${isEditable ? 'editable' : 'not editable'}`);
      return isEditable;
    } catch (error) {
      this.logger.info(`Element "${locator}" was not found or is not editable within ${timeout} seconds`);
      return false;
    }
  }

  /**
   * Checks if an element is enabled within a specified timeout period.
   * @param locator - The Playwright Locator object for the element.
   * @param timeout - The maximum time to wait for the element to be enabled (in seconds). Default is 30 seconds.
   * @returns A promise that resolves to true if the element is enabled within the timeout, false otherwise.
   */
  async isEnabled(locator: Locator, timeout: number): Promise<boolean> {
    this.logger.info(`Checking if element is enabled within ${timeout} seconds: "${locator}"`);
    try {
      await locator.waitFor({ state: 'attached', timeout: timeout });
      const isEnabled = await locator.isEnabled();
      this.logger.info(`Element "${locator}" is ${isEnabled ? 'enabled' : 'disabled'}`);
      return isEnabled;
    } catch (error) {
      this.logger.info(`Element "${locator}" was not found or is not enabled within ${timeout} seconds`);
      return false;
    }
  }

  /**
   * Checks if an element is hidden within a specified timeout period.
   * @param locator - The Playwright Locator object for the element.
   * @param timeout - The maximum time to wait for the element to be hidden (in seconds). Default is 30 seconds.
   * @returns A promise that resolves to true if the element is hidden within the timeout, false otherwise.
   */
  async isHidden(locator: Locator, timeout: number): Promise<boolean> {
    this.logger.info(`Checking if element is hidden within ${timeout} seconds: "${locator}"`);
    try {
      await locator.waitFor({ state: 'hidden', timeout: timeout });
      this.logger.info(`Element "${locator}" is hidden within ${timeout} seconds`);
      return true;
    } catch (error) {
      this.logger.info(`Element "${locator}" did not become hidden within ${timeout} seconds`);
      return false;
    }
  }

  /**
   * Checks if an element is visible within a specified timeout period.
   * @param locator - The Playwright Locator object for the element.
   * @param timeout - The maximum time to wait for the element to become visible (in seconds). Default is 30 seconds.
   * @returns A promise that resolves to true if the element becomes visible within the timeout, false otherwise.
   */
  async isVisible(locator: Locator, timeout: number): Promise<boolean> {
    this.logger.info(`Checking if element is visible within ${timeout} seconds: "${locator}"`);
    try {
      await locator.waitFor({ state: 'visible', timeout: timeout });
      this.logger.info(`Element "${locator}" became visible within ${timeout} seconds`);
      return true;
    } catch (error) {
      this.logger.info(`Element "${locator}" did not become visible within ${timeout} seconds`);
      return false;
    }
  }

  /**
   * Checks if an element has a specific CSS property with the expected value.
   * @param locator - The Playwright Locator object for the element.
   * @param property - The CSS property name to check.
   * @param expectedValue - The expected CSS property value.
   * @returns A promise that resolves to true if the element has the CSS property with the expected value, false otherwise.
   */
  async hasCssProperty(locator: Locator, property: string, expectedValue: string): Promise<boolean> {
    this.logger.info(`Checking if element has CSS property "${property}" with value "${expectedValue}": "${locator}"`);
    try {
      // Get the computed style of the element
      const actualValue = await locator.evaluate((el, prop) => {
        return window.getComputedStyle(el).getPropertyValue(prop as string);
      }, property);
      
      const hasProperty = actualValue.trim() === expectedValue.trim();
      this.logger.info(`Element "${locator}" has CSS property "${property}" with value "${actualValue}". Expected: "${expectedValue}". Match: ${hasProperty}`);
      return hasProperty;
    } catch (error) {
      const errorMessage = `Failed to check CSS property "${property}" on element: "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      return false;
    }
  }

  /**
   * Checks if an element contains specific text.
   * @param locator - The Playwright Locator object for the element.
   * @param text - The text to check for within the element.
   * @returns A promise that resolves to true if the element contains the text, false otherwise.
   */
  async isContainsText(locator: Locator, text: string): Promise<boolean> {
    this.logger.info(`Checking if element contains text "${text}": "${locator}"`);
    try {
      const elementText = await locator.textContent() || '';
      const containsText = elementText.includes(text);
      this.logger.info(`Element "${locator}" ${containsText ? 'contains' : 'does not contain'} text "${text}"`);
      return containsText;
    } catch (error) {
      const errorMessage = `Failed to check if element contains text "${text}": "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      return false;
    }
  }

  /**
   * Checks if an element does not contain specific text.
   * @param locator - The Playwright Locator object for the element.
   * @param text - The text to check for within the element.
   * @returns A promise that resolves to true if the element does not contain the text, false otherwise.
   */
  async isNotContainsText(locator: Locator, text: string): Promise<boolean> {
    this.logger.info(`Checking if element does not contain text "${text}": "${locator}"`);
    try {
      const elementText = await locator.textContent() || '';
      const containsText = elementText.includes(text);
      const notContainsText = !containsText;
      this.logger.info(`Element "${locator}" ${notContainsText ? 'does not contain' : 'contains'} text "${text}"`);
      return notContainsText;
    } catch (error) {
      const errorMessage = `Failed to check if element does not contain text "${text}": "${locator}". Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      return false;
    }
  }
}
