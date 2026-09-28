import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';
import { GenericAssertions } from '@assertions/generic.assertions';

/**
 * SauceDemoCartPage class represents the cart page (cart.html) on
 * https://www.saucedemo.com/.
 */
export class SauceDemoCartPage extends BasePage {
  // --- Locators ---

  private readonly cartItems: Locator = this.getPage().locator('.cart_item');
  private readonly itemNames: Locator = this.getPage().locator('.cart_item .inventory_item_name');
  private readonly checkoutButton: Locator = this.getPage().locator('#checkout');
  private readonly continueShoppingButton: Locator = this.getPage().locator('[data-test="continue-shopping"]');

  private readonly genericAssertions: GenericAssertions = new GenericAssertions(this.logger);

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Locator Helpers ---

  private itemRowByName(name: string): Locator {
    return this.cartItems.filter({ has: this.getPage().locator('.inventory_item_name', { hasText: name }) });
  }

  // --- Page-Specific Actions ---

  /**
   * Removes a product from the cart by its display name.
   * @param productName - The exact product name as shown in the cart.
   * @returns The current SauceDemoCartPage instance for method chaining.
   */
  async removeProduct(productName: string): Promise<this> {
    await this.logger.info(`Removing product from cart: "${productName}"`);
    await this.actions.click(this.itemRowByName(productName).locator('button'));
    return this;
  }

  /**
   * Proceeds to checkout.
   * @returns The current SauceDemoCartPage instance for method chaining.
   */
  async checkout(): Promise<this> {
    await this.logger.info('Proceeding to checkout.');
    await this.actions.click(this.checkoutButton);
    return this;
  }

  /**
   * Returns to the Products page.
   * @returns The current SauceDemoCartPage instance for method chaining.
   */
  async continueShopping(): Promise<this> {
    await this.logger.info('Continuing shopping (returning to Products page).');
    await this.actions.click(this.continueShoppingButton);
    return this;
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts the number of line items in the cart.
   * @param count - The expected number of cart line items.
   * @returns The current SauceDemoCartPage instance for method chaining.
   */
  async expectItemCount(count: number): Promise<this> {
    await this.logger.info(`Asserting cart item count to be: ${count}`);
    await this.genericAssertions.toBe(await this.cartItems.count(), count);
    return this;
  }

  /**
   * Asserts that a product with the given name is present in the cart.
   * @param productName - The exact product name expected in the cart.
   * @returns The current SauceDemoCartPage instance for method chaining.
   */
  async expectProductInCart(productName: string): Promise<this> {
    await this.logger.info(`Asserting product is in the cart: "${productName}"`);
    await this.assertions.expectToBeVisible(this.itemRowByName(productName));
    return this;
  }

  /**
   * Asserts that a product with the given name is absent from the cart.
   * @param productName - The exact product name expected to be absent.
   * @returns The current SauceDemoCartPage instance for method chaining.
   */
  async expectProductNotInCart(productName: string): Promise<this> {
    await this.logger.info(`Asserting product is NOT in the cart: "${productName}"`);
    await this.genericAssertions.toBe(await this.itemRowByName(productName).count(), 0);
    return this;
  }

  // --- Value Getters ---

  /**
   * Gets the display names of every product line currently in the cart.
   * @returns An array of product names.
   */
  async getItemNames(): Promise<string[]> {
    const count = await this.itemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push((await this.itemNames.nth(i).textContent())?.trim() ?? '');
    }
    return names;
  }
}
