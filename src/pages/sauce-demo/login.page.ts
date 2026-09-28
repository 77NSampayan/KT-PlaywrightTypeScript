import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';
import { GotoOptions } from '@app-types/optional-parameter.types';
import { TIMEOUTS } from '@utils/config-util';

const SAUCE_DEMO_URL = 'https://www.saucedemo.com/';

/**
 * SauceDemoLoginPage class represents the login page of https://www.saucedemo.com/.
 * It encapsulates all elements and actions specific to the login page,
 * inheriting common functionalities from BasePage.
 */
export class SauceDemoLoginPage extends BasePage {
  // --- Locators ---

  private readonly usernameInput: Locator = this.getPage().locator('#user-name');
  private readonly passwordInput: Locator = this.getPage().locator('#password');
  private readonly loginButton: Locator = this.getPage().locator('#login-button');
  private readonly errorMessage: Locator = this.getPage().locator('[data-test="error"]');

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Page-Specific Actions ---

  async navigateToSauceDemoLoginPage(options?: GotoOptions): Promise<this> {
    await this.logger.info('Navigating to the Sauce Demo login page...');
    await this.goto(SAUCE_DEMO_URL, options);
    await this.actions.waitForElementState(this.usernameInput, { state: 'visible', timeout: TIMEOUTS.action });
    await this.logger.info('Landed on the Sauce Demo login page.');
    return this;
  }

  /**
   * Fills in the username field.
   * @param username - The username to enter.
   * @returns The current SauceDemoLoginPage instance for method chaining.
   */
  async fillUsername(username: string): Promise<this> {
    await this.logger.info(`Entering username: ${username}`);
    await this.actions.fill(this.usernameInput, username);
    return this;
  }

  /**
   * Fills in the password field.
   * @param password - The password to enter.
   * @returns The current SauceDemoLoginPage instance for method chaining.
   */
  async fillPassword(password: string): Promise<this> {
    await this.logger.info('Entering password.'); // Avoid logging actual passwords
    await this.actions.fill(this.passwordInput, password);
    return this;
  }

  /**
   * Clicks the login button.
   * @returns The current SauceDemoLoginPage instance for method chaining.
   */
  async clickLogin(): Promise<this> {
    await this.logger.info('Clicking the Login button.');
    await this.actions.click(this.loginButton);
    return this;
  }

  /**
   * Performs the complete login flow by entering username, password, and clicking login.
   * Note: Assumes the page is already navigated to the login page.
   * @param username - The username to enter.
   * @param password - The password to enter.
   * @returns The current SauceDemoLoginPage instance for method chaining.
   */
  async login(username: string, password: string): Promise<this> {
    this.logger.info('Performing login action.');
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
    await this.logger.info('Login action completed.');
    return this;
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts that the login page is visible by checking for the username and password inputs.
   * @returns The current SauceDemoLoginPage instance for method chaining.
   */
  async expectLoginPageToBeVisible(): Promise<this> {
    await this.logger.info('Asserting that the Login Page is visible.');
    await this.assertions.expectToBeVisible(this.usernameInput);
    await this.assertions.expectToBeVisible(this.passwordInput);
    await this.logger.info('Assertion passed: Login Page is visible.');
    return this;
  }

  /**
   * Asserts that a login error message is visible.
   * @returns The current SauceDemoLoginPage instance for method chaining.
   */
  async expectErrorMessageToBeVisible(): Promise<this> {
    await this.logger.info('Asserting that a login error message is visible.');
    await this.assertions.expectToBeVisible(this.errorMessage);
    await this.logger.info('Assertion passed: Login error message is visible.');
    return this;
  }

  /**
   * Asserts that the login error message contains the expected text.
   * @param text - The expected substring of the error message.
   * @returns The current SauceDemoLoginPage instance for method chaining.
   */
  async expectErrorMessageToContainText(text: string): Promise<this> {
    await this.logger.info(`Asserting login error message contains text: "${text}"`);
    await this.assertions.expectAllToContainText([this.errorMessage], text);
    await this.logger.info('Assertion passed: Error message contains expected text.');
    return this;
  }
}
