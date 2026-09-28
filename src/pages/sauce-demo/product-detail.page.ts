import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';

/**
 * SauceDemoProductDetailPage class represents the individual product detail page
 * (inventory-item.html) on https://www.saucedemo.com/, reached by clicking a
 * product name or image on the Products page.
 */
export class SauceDemoProductDetailPage extends BasePage {
  // --- Locators ---

  private readonly productName: Locator = this.getPage().locator('[data-test="inventory-item-name"]');
  private readonly productDescription: Locator = this.getPage().locator('[data-test="inventory-item-desc"]');
  private readonly productPrice: Locator = this.getPage().locator('[data-test="inventory-item-price"]');
  private readonly cartButton: Locator = this.getPage().locator('button.btn_inventory');
  private readonly backToProductsButton: Locator = this.getPage().locator('[data-test="back-to-products"]');

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Page-Specific Actions ---

  /**
   * Adds the currently displayed product to the cart.
   * @returns The current SauceDemoProductDetailPage instance for method chaining.
   */
  async addToCart(): Promise<this> {
    await this.logger.info('Adding the current product to cart.');
    await this.actions.click(this.cartButton);
    return this;
  }

  /**
   * Removes the currently displayed product from the cart.
   * @returns The current SauceDemoProductDetailPage instance for method chaining.
   */
  async removeFromCart(): Promise<this> {
    await this.logger.info('Removing the current product from cart.');
    await this.actions.click(this.cartButton);
    return this;
  }

  /**
   * Navigates back to the Products page.
   * @returns The current SauceDemoProductDetailPage instance for method chaining.
   */
  async goBackToProducts(): Promise<this> {
    await this.logger.info('Navigating back to the Products page.');
    await this.actions.click(this.backToProductsButton);
    return this;
  }

  // --- Value Getters ---

  /**
   * Gets the displayed product name.
   * @returns The product name text.
   */
  async getProductName(): Promise<string> {
    return (await this.actions.getTextContent(this.productName)) ?? '';
  }

  /**
   * Gets the displayed product price.
   * @returns The product price text (e.g. "$29.99").
   */
  async getProductPrice(): Promise<string> {
    return (await this.actions.getTextContent(this.productPrice)) ?? '';
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts that the product detail page is showing the given product.
   * @param name - The expected product name.
   * @param price - The expected product price (e.g. "$29.99").
   * @returns The current SauceDemoProductDetailPage instance for method chaining.
   */
  async expectProductDetails(name: string, price: string): Promise<this> {
    await this.logger.info(`Asserting product detail page shows "${name}" at "${price}".`);
    await this.assertions.expectAllToHaveText([this.productName], name);
    await this.assertions.expectAllToHaveText([this.productPrice], price);
    await this.assertions.expectToBeVisible(this.productDescription);
    return this;
  }

  /**
   * Asserts the cart action button's current label ("Add to cart" or "Remove").
   * @param label - The expected button label.
   * @returns The current SauceDemoProductDetailPage instance for method chaining.
   */
  async expectCartButtonLabel(label: 'Add to cart' | 'Remove'): Promise<this> {
    await this.logger.info(`Asserting cart button label is: "${label}"`);
    await this.assertions.expectAllToHaveText([this.cartButton], label);
    return this;
  }
}
