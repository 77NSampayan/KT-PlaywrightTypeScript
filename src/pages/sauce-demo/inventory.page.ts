import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';
import { TextConstants } from '@constants/text.constants';

/**
 * SauceDemoInventoryPage class represents the Products (inventory) page that
 * https://www.saucedemo.com/ redirects to after a successful login.
 */
export class SauceDemoInventoryPage extends BasePage {
  // --- Locators ---

  private readonly pageTitle: Locator = this.getPage().locator('.title');
  private readonly appLogo: Locator = this.getPage().locator('.app_logo');

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts that the user has landed on the Products (inventory) page after login.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async expectLandedInInventoryPage(): Promise<this> {
    await this.logger.info('Asserting that landed in the Inventory (Products) Page.');
    await this.assertions.expectToBeVisible(this.appLogo);
    await this.assertions.expectAllToHaveText([this.pageTitle], TextConstants.SauceDemoInventoryPage.title);
    await this.logger.info('Assertion passed: Landed in Inventory Page.');
    return this;
  }
}
