import { Page } from '@playwright/test';
import { Logger } from '@utils/logger-util';
import { ElementActions } from '@actions/element.actions';
import { PageAssertions } from '@assertions/page.assertions';
// Import custom parameter types
import {
  GotoOptions,
  ReloadOptions,
  PageToHaveURLOptions,
  PageToHaveTitleOptions,
  PageWaitForLoadState
} from '@app-types/optional-parameter.types';
import { TIMEOUTS } from '@utils/config-util';

/**
 * BasePage class serves as the foundation for all Page Objects in the framework.
 * It provides common page-level functionalities like navigation and access to
 * element interactions and assertions through composition.
 */
export class BasePage {
  protected readonly page: Page;
  protected readonly logger: Logger;
  protected readonly elementActions: ElementActions;
  protected readonly pageAssertions: PageAssertions;

  /**
   * @param page - The Playwright Page object, injected by the test fixture.
   * @param logger - An instance of the Logger utility for consistent logging.
   * @param elementActions - Optional ElementActions instance for element interactions. If not provided, a new instance will be created.
   * @param pageAssertions - Optional PageAssertions instance for page assertions. If not provided, a new instance will be created.
   */
  constructor(
    page: Page, 
    logger: Logger, 
    elementActions?: ElementActions, 
    pageAssertions?: PageAssertions
  ) {
    this.page = page;
    this.logger = logger;
    this.elementActions = elementActions ?? new ElementActions(logger);
    this.pageAssertions = pageAssertions ?? new PageAssertions(logger);
  }

  // --- Navigation Actions ---

  /**
   * Navigates to the specified URL.
   * @param url - The URL to navigate to. If not provided, navigates to the baseURL.
   * @param options - Optional navigation parameters.
   * @returns The current BasePage instance for method chaining.
   */
  async goto(url: string = '', options?: GotoOptions): Promise<this> {
    const targetUrl = url || ''; // If url is empty, Playwright will use baseURL from config
    this.logger.info(`Navigating to URL: ${targetUrl || '(baseURL from config)'}`);
    
    try {
      await this.getPage().goto(targetUrl, options);
      this.logger.info(`Successfully navigated to: ${this.getPage().url()}`);
      
      // Wait for the page to reach a stable state after navigation with 30 seconds timeout
      await this.getPage().waitForLoadState('load', { timeout: TIMEOUTS.navigation });
      this.logger.info('Page loaded and stable after navigation.');
      
      return this;
    } catch (error) {
      const errorMessage = `Failed to navigate to URL: ${targetUrl || '(baseURL from config)'}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Navigation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Reloads the current page.
   * @param options - Optional navigation parameters.
   * @returns The current BasePage instance for method chaining.
   */
  async reload(options?: ReloadOptions): Promise<this> {
    this.logger.info(`Reloading the current page: ${this.getPage().url()}`);
    
    try {
      await this.getPage().reload(options);
      this.logger.info('Page reloaded successfully.');
      
      // Wait for the page to reach a stable state after reload with 30 seconds timeout
      await this.getPage().waitForLoadState('load', { timeout: TIMEOUTS.navigation });
      this.logger.info('Page loaded and stable after reload.');
      
      return this;
    } catch (error) {
      const errorMessage = `Failed to reload the page: ${this.getPage().url()}. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`Reload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Navigates back in the browser history.
   * @returns The current BasePage instance for method chaining.
   */
  async goBack(): Promise<this> {
    this.logger.info('Navigating back in browser history.');
    
    try {
      await this.getPage().goBack();
      this.logger.info(`Navigated back to: ${this.getPage().url()}`);
      
      // Wait for the page to reach a stable state after navigation with 30 seconds timeout
      await this.getPage().waitForLoadState('load', { timeout: TIMEOUTS.navigation });
      this.logger.info('Page loaded and stable after navigating back.');
      
      return this;
    } catch (error) {
      const errorMessage = `Failed to navigate back in browser history. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`GoBack failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Navigates forward in the browser history.
   * @returns The current BasePage instance for method chaining.
   */
  async goForward(): Promise<this> {
    this.logger.info('Navigating forward in browser history.');
    
    try {
      await this.getPage().goForward();
      this.logger.info(`Navigated forward to: ${this.getPage().url()}`);
      
      // Wait for the page to reach a stable state after navigation with 30 seconds timeout
      await this.getPage().waitForLoadState('load', { timeout: TIMEOUTS.navigation });
      this.logger.info('Page loaded and stable after navigating forward.');
      
      return this;
    } catch (error) {
      const errorMessage = `Failed to navigate forward in browser history. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`GoForward failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // --- Wait Actions ---

  /**
   * Pauses the test execution for a specified amount of time.
   * Use with caution as it can make tests slower and flakier.
   * Prefer explicit waits over fixed timeouts.
   * @param milliseconds - The number of milliseconds to wait.
   * @returns The current BasePage instance for method chaining.
   */
  async waitForTimeout(seconds: number): Promise<this> {
    this.logger.warn(`Waiting for a fixed timeout of ${seconds}ms. Consider using an explicit wait if possible.`);
    await this.getPage().waitForTimeout(1000 * seconds);
    this.logger.info(`Finished waiting for ${seconds}ms.`);
    return this;
  }

  /**
   * Waits for a specific page state condition to be met.
   * This is useful for waiting for dynamic content or state changes on the page.
   * @param condition - A function that returns a truthy value when the desired state is reached.
   * @param timeout - Optional timeout in milliseconds (defaults to 1000 * 30ms).
   * @param message - Optional message to log when waiting starts.
   * @returns The current BasePage instance for method chaining.
   */
  async waitForLoadState(loadState?: "load" | "domcontentloaded" | "networkidle" | undefined, options?: PageWaitForLoadState): Promise<this> {
    await this.getPage().waitForLoadState(loadState, options);
    this.logger.info('Page state condition met successfully.');
    return this;
  }

  // --- Page Assertion Actions (delegating to PageAssertions) ---

  /**
   * Asserts that the page URL matches the given pattern.
   * @param urlPattern - The expected URL or a regular expression.
   * @param options - Optional assertion parameters.
   * @returns The current BasePage instance for method chaining.
   */
  async expectToHaveURL(urlPattern: string | RegExp, options?: PageToHaveURLOptions): Promise<this> {
    await this.pageAssertions.expectToHaveURL(this.page, urlPattern, options);
    return this;
  }

  /**
   * Asserts that the page title matches the given pattern.
   * @param titlePattern - The expected title or a regular expression.
   * @param options - Optional assertion parameters.
   * @returns The current BasePage instance for method chaining.
   */
  async expectToHaveTitle(titlePattern: string | RegExp, options?: PageToHaveTitleOptions): Promise<this> {
    await this.pageAssertions.expectToHaveTitle(this.page, titlePattern, options);
    return this;
  }

  // --- Value Getters ---

  /**
   * Gets the current page URL.
   * @returns The current page URL.
   */
  getCurrentUrl(): string {
    const url = this.page.url();
    this.logger.info(`Current page URL: ${url}`);
    return url;
  }

  /**
   * Gets the current page title.
   * @returns A promise that resolves to the current page title.
   */
  async getPageTitle(): Promise<string> {
    try {
      const title = await this.page.title();
      this.logger.info(`Current page title: ${title}`);
      return title;
    } catch (error) {
      const errorMessage = `Failed to get page title. Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      this.logger.error(errorMessage);
      throw new Error(`GetPageTitle failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets the Playwright Page object.
   * This provides access to the underlying page for advanced operations or cleanup.
   * @returns The Playwright Page object.
   */
  public getPage(): Page {
    this.logger.info('Accessing Playwright Page object directly.');
    return this.page;
  }

  /**
   * Gets the ElementActions instance for performing element interactions.
   * This allows specific page objects to utilize these actions.
   * @returns The ElementActions instance.
   */
  public get actions(): ElementActions {
    return this.elementActions;
  }

  /**
   * Gets the PageAssertions instance for performing assertions.
   * This allows specific page objects to utilize these assertions.
   * @returns The PageAssertions instance.
   */
  public get assertions(): PageAssertions {
    return this.pageAssertions;
  }
}
