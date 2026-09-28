import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';

/**
 * SauceDemoCheckoutStepOnePage class represents the "Checkout: Your Information"
 * page (checkout-step-one.html) on https://www.saucedemo.com/.
 */
export class SauceDemoCheckoutStepOnePage extends BasePage {
  // --- Locators ---

  private readonly firstNameInput: Locator = this.getPage().locator('#first-name');
  private readonly lastNameInput: Locator = this.getPage().locator('#last-name');
  private readonly postalCodeInput: Locator = this.getPage().locator('#postal-code');
  private readonly continueButton: Locator = this.getPage().locator('#continue');
  private readonly cancelButton: Locator = this.getPage().locator('[data-test="cancel"]');
  private readonly errorMessage: Locator = this.getPage().locator('[data-test="error"]');

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Page-Specific Actions ---

  /**
   * Fills in the checkout information form.
   * @param firstName - The first name to enter.
   * @param lastName - The last name to enter.
   * @param postalCode - The zip/postal code to enter.
   * @returns The current SauceDemoCheckoutStepOnePage instance for method chaining.
   */
  async fillCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<this> {
    await this.logger.info(`Filling checkout information: firstName="${firstName}", lastName="${lastName}", postalCode="${postalCode}"`);
    await this.actions.fill(this.firstNameInput, firstName);
    await this.actions.fill(this.lastNameInput, lastName);
    await this.actions.fill(this.postalCodeInput, postalCode);
    return this;
  }

  /**
   * Clicks Continue to proceed to the checkout overview.
   * @returns The current SauceDemoCheckoutStepOnePage instance for method chaining.
   */
  async continue(): Promise<this> {
    await this.logger.info('Clicking Continue.');
    await this.actions.click(this.continueButton);
    return this;
  }

  /**
   * Fills the checkout information form and clicks Continue.
   * @param firstName - The first name to enter.
   * @param lastName - The last name to enter.
   * @param postalCode - The zip/postal code to enter.
   * @returns The current SauceDemoCheckoutStepOnePage instance for method chaining.
   */
  async submitCheckoutInformation(firstName: string, lastName: string, postalCode: string): Promise<this> {
    await this.fillCheckoutInformation(firstName, lastName, postalCode);
    await this.continue();
    return this;
  }

  /**
   * Cancels checkout and returns to the cart page.
   * @returns The current SauceDemoCheckoutStepOnePage instance for method chaining.
   */
  async cancel(): Promise<this> {
    await this.logger.info('Cancelling checkout.');
    await this.actions.click(this.cancelButton);
    return this;
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts that a validation error message containing the given text is shown.
   * @param text - The expected substring of the error message.
   * @returns The current SauceDemoCheckoutStepOnePage instance for method chaining.
   */
  async expectErrorMessageToContainText(text: string): Promise<this> {
    await this.logger.info(`Asserting checkout error message contains text: "${text}"`);
    await this.assertions.expectAllToContainText([this.errorMessage], text);
    return this;
  }
}
