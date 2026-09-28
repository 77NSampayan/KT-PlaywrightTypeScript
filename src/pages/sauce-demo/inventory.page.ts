import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';
import { GenericAssertions } from '@assertions/generic.assertions';
import { TextConstants } from '@constants/text.constants';
import { TIMEOUTS } from '@utils/config-util';

export type SauceDemoSortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * SauceDemoInventoryPage class represents the Products (inventory) page that
 * https://www.saucedemo.com/ redirects to after a successful login.
 */
export class SauceDemoInventoryPage extends BasePage {
  // --- Locators ---

  private readonly pageTitle: Locator = this.getPage().locator('.title');
  private readonly appLogo: Locator = this.getPage().locator('.app_logo');
  private readonly sortDropdown: Locator = this.getPage().locator('[data-test="product-sort-container"]');
  private readonly inventoryItems: Locator = this.getPage().locator('.inventory_item');
  private readonly itemNames: Locator = this.getPage().locator('.inventory_item_name');
  private readonly itemPrices: Locator = this.getPage().locator('.inventory_item_price');
  private readonly cartBadge: Locator = this.getPage().locator('.shopping_cart_badge');
  private readonly cartLink: Locator = this.getPage().locator('.shopping_cart_link');
  private readonly burgerMenuButton: Locator = this.getPage().locator('#react-burger-menu-btn');
  private readonly burgerCloseButton: Locator = this.getPage().locator('#react-burger-cross-btn');
  private readonly logoutLink: Locator = this.getPage().locator('#logout_sidebar_link');
  private readonly resetAppStateLink: Locator = this.getPage().locator('#reset_sidebar_link');

  private readonly genericAssertions: GenericAssertions = new GenericAssertions(this.logger);

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Locator Helpers ---

  private itemCardByName(name: string): Locator {
    return this.inventoryItems.filter({ has: this.getPage().locator('.inventory_item_name', { hasText: name }) });
  }

  // --- Page-Specific Actions ---

  /**
   * Sorts the product list using the dropdown on the Products page.
   * @param option - 'az' (Name A-Z), 'za' (Name Z-A), 'lohi' (Price low to high), 'hilo' (Price high to low).
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async sortBy(option: SauceDemoSortOption): Promise<this> {
    await this.logger.info(`Sorting products by: "${option}"`);
    await this.actions.selectOption(this.sortDropdown, option);
    return this;
  }

  /**
   * Adds a product to the cart by its display name.
   * @param productName - The exact product name as shown on the Products page.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async addProductToCart(productName: string): Promise<this> {
    await this.logger.info(`Adding product to cart: "${productName}"`);
    await this.actions.click(this.itemCardByName(productName).locator('button.btn_inventory'));
    return this;
  }

  /**
   * Removes a product from the cart (from the Products page) by its display name.
   * @param productName - The exact product name as shown on the Products page.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async removeProductFromCart(productName: string): Promise<this> {
    await this.logger.info(`Removing product from cart: "${productName}"`);
    await this.actions.click(this.itemCardByName(productName).locator('button.btn_inventory'));
    return this;
  }

  /**
   * Opens the detail page of a product by clicking its name.
   * @param productName - The exact product name as shown on the Products page.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async openProductDetails(productName: string): Promise<this> {
    await this.logger.info(`Opening product details for: "${productName}"`);
    await this.actions.click(this.itemCardByName(productName).locator('.inventory_item_name'));
    return this;
  }

  /**
   * Navigates to the cart page via the cart icon in the header.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async openCart(): Promise<this> {
    await this.logger.info('Opening the cart.');
    await this.actions.click(this.cartLink);
    return this;
  }

  /**
   * Opens the burger (hamburger) side menu.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async openBurgerMenu(): Promise<this> {
    await this.logger.info('Opening the burger menu.');
    await this.actions.click(this.burgerMenuButton);
    await this.actions.waitForElementState(this.logoutLink, { state: 'visible', timeout: TIMEOUTS.action });
    return this;
  }

  /**
   * Logs the current user out via the burger menu.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async logout(): Promise<this> {
    await this.logger.info('Logging out.');
    await this.openBurgerMenu();
    await this.actions.click(this.logoutLink);
    return this;
  }

  /**
   * Resets the application state (empties the cart) via the burger menu.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async resetAppState(): Promise<this> {
    await this.logger.info('Resetting app state.');
    await this.openBurgerMenu();
    await this.actions.click(this.resetAppStateLink);
    await this.actions.click(this.burgerCloseButton);
    return this;
  }

  // --- Value Getters ---

  /**
   * Gets the display names of every product currently listed, in DOM order.
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

  /**
   * Gets the prices of every product currently listed, in DOM order.
   * @returns An array of numeric prices (e.g. 29.99).
   */
  async getItemPrices(): Promise<number[]> {
    const count = await this.itemPrices.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = (await this.itemPrices.nth(i).textContent()) ?? '';
      prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
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

  /**
   * Asserts the total number of products displayed on the Products page.
   * @param count - The expected number of products.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async expectItemCount(count: number): Promise<this> {
    await this.logger.info(`Asserting inventory item count to be: ${count}`);
    await this.genericAssertions.toBe(await this.inventoryItems.count(), count);
    return this;
  }

  /**
   * Asserts the number displayed on the cart badge.
   * @param count - The expected cart item count.
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async expectCartBadgeCount(count: number): Promise<this> {
    await this.logger.info(`Asserting cart badge count to be: ${count}`);
    await this.assertions.expectAllToHaveText([this.cartBadge], String(count));
    return this;
  }

  /**
   * Asserts that the cart badge is not shown (i.e. the cart is empty).
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async expectCartBadgeHidden(): Promise<this> {
    await this.logger.info('Asserting cart badge is hidden (cart is empty).');
    await this.assertions.expectAllToBeHidden([this.cartBadge]);
    return this;
  }

  /**
   * Asserts that the products are sorted by name.
   * @param direction - 'ascending' (A-Z) or 'descending' (Z-A).
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async expectProductsSortedByName(direction: 'ascending' | 'descending'): Promise<this> {
    await this.logger.info(`Asserting products are sorted by name (${direction}).`);
    const names = await this.getItemNames();
    const expected = [...names].sort((a, b) => (direction === 'ascending' ? a.localeCompare(b) : b.localeCompare(a)));
    await this.genericAssertions.toEqual(names, expected);
    return this;
  }

  /**
   * Asserts that the products are sorted by price.
   * @param direction - 'ascending' (low to high) or 'descending' (high to low).
   * @returns The current SauceDemoInventoryPage instance for method chaining.
   */
  async expectProductsSortedByPrice(direction: 'ascending' | 'descending'): Promise<this> {
    await this.logger.info(`Asserting products are sorted by price (${direction}).`);
    const prices = await this.getItemPrices();
    const expected = [...prices].sort((a, b) => (direction === 'ascending' ? a - b : b - a));
    await this.genericAssertions.toEqual(prices, expected);
    return this;
  }
}
