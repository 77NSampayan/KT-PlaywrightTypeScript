import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';
import { GotoOptions } from '@app-types/optional-parameter.types';
import { TIMEOUTS } from '@utils/config-util';
import { TextConstants } from '@constants/text.constants';

/**
 * LoginPage class represents the login page of the application.
 * It encapsulates all elements and actions specific to the login page,
 * inheriting common functionalities from BasePage.
 */
export class LoginPage extends BasePage {
  // --- Locators ---
  // It's good practice to define locators as private readonly properties.

  private readonly loginFormHeader: Locator = this.getPage().getByText(TextConstants.LoginPage.header);
  private readonly loginUsernameInput: Locator = this.getPage().locator('input#username');
  private readonly loginPasswordInput: Locator = this.getPage().locator('input#password');
  private readonly loginAuthenticateButton: Locator = this.getPage().getByText(TextConstants.LoginPage.authenticate);

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Page-Specific Actions ---
  async navigateToAppLoginPage(url?: string, options?: GotoOptions): Promise<this> {
    await this.logger.info('Navigating to the target page...');
    await this.goto(url, options);
    await this.actions.waitForElementState(this.loginFormHeader, { state: 'visible', timeout: TIMEOUTS.action })
    await this.logger.info('Navigating to the target page...');
    return this;
  }

  /**
   * Fills in the username field.
   * @param username - The username to enter.
   * @returns The current LoginPage instance for method chaining.
   */
  async fillUsername(username: string): Promise<this> {
    await this.logger.info(`Entering username: ${username}`);
    await this.actions.fill(this.loginUsernameInput, username);
    return this;
  }

  /**
   * Fills in the password field.
   * @param password - The password to enter.
   * @returns The current LoginPage instance for method chaining.
   */
  async fillPassword(password: string): Promise<this> {
    await this.logger.info('Entering password.'); // Avoid logging actual passwords
    await this.actions.fill(this.loginPasswordInput, password);
    return this;
  }

  /**
   * Clicks the login button.
   * @returns The current LoginPage instance for method chaining.
   */
  async authenticateCredential(): Promise<this> {
    await this.logger.info('Clicking the Login button.');
    await this.actions.click(this.loginAuthenticateButton);
    return this;
  }

  /**
   * Performs the complete login flow by entering username, password, and clicking login.
   * Note: Assumes the page is already navigated to the login page.
   * @param username - The username to enter.
   * @param password - The password to enter.
   * @returns The current LoginPage instance for method chaining.
   */
  async login(username: string, password: string): Promise<this> {
    this.logger.info('Performing login action.');
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.authenticateCredential();
    await this.logger.info('Login action completed.');
    return this;
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts that the login page is visible by checking for the username input.
   * @returns The current LoginPage instance for method chaining.
   */
  async expectLoginPageToBeVisible(): Promise<this> {
    await this.logger.info('Asserting that the Login Page is visible.');
    await this.assertions.expectToBeVisible(this.loginUsernameInput);
    await this.logger.info('Assertion passed: Login Page is visible.');
    return this;
  }
}