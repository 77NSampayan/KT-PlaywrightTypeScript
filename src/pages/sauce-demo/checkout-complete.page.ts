import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';
import { TextConstants } from '@constants/text.constants';

/**
 * SauceDemoCheckoutCompletePage class represents the order confirmation page
 * (checkout-complete.html) on https://www.saucedemo.com/.
 */
export class SauceDemoCheckoutCompletePage extends BasePage {
  // --- Locators ---

  private readonly completeHeader: Locator = this.getPage().locator('[data-test="complete-header"]');
  private readonly backHomeButton: Locator = this.getPage().locator('[data-test="back-to-products"]');

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Page-Specific Actions ---

  /**
   * Returns to the Products page.
   * @returns The current SauceDemoCheckoutCompletePage instance for method chaining.
   */
  async backHome(): Promise<this> {
    await this.logger.info('Navigating back home from order confirmation.');
    await this.actions.click(this.backHomeButton);
    return this;
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts that the order confirmation message is displayed.
   * @returns The current SauceDemoCheckoutCompletePage instance for method chaining.
   */
  async expectOrderCompleted(): Promise<this> {
    await this.logger.info('Asserting order confirmation is displayed.');
    await this.assertions.expectAllToHaveText([this.completeHeader], TextConstants.SauceDemoCheckoutCompletePage.header);
    return this;
  }
}
