import { Page, Locator } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { Logger } from '@utils/logger-util';
import { GenericAssertions } from '@assertions/generic.assertions';

/**
 * SauceDemoCheckoutStepTwoPage class represents the "Checkout: Overview" page
 * (checkout-step-two.html) on https://www.saucedemo.com/.
 */
export class SauceDemoCheckoutStepTwoPage extends BasePage {
  // --- Locators ---

  private readonly cartItems: Locator = this.getPage().locator('.cart_item');
  private readonly subtotalLabel: Locator = this.getPage().locator('[data-test="subtotal-label"]');
  private readonly taxLabel: Locator = this.getPage().locator('[data-test="tax-label"]');
  private readonly totalLabel: Locator = this.getPage().locator('[data-test="total-label"]');
  private readonly finishButton: Locator = this.getPage().locator('[data-test="finish"]');
  private readonly cancelButton: Locator = this.getPage().locator('[data-test="cancel"]');

  private readonly genericAssertions: GenericAssertions = new GenericAssertions(this.logger);

  /**
   * @param page - The Playwright Page object.
   * @param logger - An instance of the Logger utility.
   */
  constructor(page: Page, logger: Logger) {
    super(page, logger);
  }

  // --- Page-Specific Actions ---

  /**
   * Completes the order.
   * @returns The current SauceDemoCheckoutStepTwoPage instance for method chaining.
   */
  async finish(): Promise<this> {
    await this.logger.info('Finishing the order.');
    await this.actions.click(this.finishButton);
    return this;
  }

  /**
   * Cancels checkout and returns to the Products page.
   * @returns The current SauceDemoCheckoutStepTwoPage instance for method chaining.
   */
  async cancel(): Promise<this> {
    await this.logger.info('Cancelling checkout.');
    await this.actions.click(this.cancelButton);
    return this;
  }

  // --- Value Getters ---

  /**
   * Gets the "Item total: $X.XX" subtotal amount as a number.
   * @returns The subtotal amount.
   */
  async getSubtotal(): Promise<number> {
    const text = (await this.actions.getTextContent(this.subtotalLabel)) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Gets the "Tax: $X.XX" amount as a number.
   * @returns The tax amount.
   */
  async getTax(): Promise<number> {
    const text = (await this.actions.getTextContent(this.taxLabel)) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  /**
   * Gets the "Total: $X.XX" amount as a number.
   * @returns The total amount.
   */
  async getTotal(): Promise<number> {
    const text = (await this.actions.getTextContent(this.totalLabel)) ?? '';
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  // --- Page-Specific Assertions ---

  /**
   * Asserts the number of line items shown in the order overview.
   * @param count - The expected number of line items.
   * @returns The current SauceDemoCheckoutStepTwoPage instance for method chaining.
   */
  async expectItemCount(count: number): Promise<this> {
    await this.logger.info(`Asserting checkout overview item count to be: ${count}`);
    await this.genericAssertions.toBe(await this.cartItems.count(), count);
    return this;
  }

  /**
   * Asserts that the order total equals the subtotal plus tax.
   * @returns The current SauceDemoCheckoutStepTwoPage instance for method chaining.
   */
  async expectTotalToEqualSubtotalPlusTax(): Promise<this> {
    await this.logger.info('Asserting total equals subtotal plus tax.');
    const subtotal = await this.getSubtotal();
    const tax = await this.getTax();
    const total = await this.getTotal();
    await this.genericAssertions.toBeCloseTo(total, subtotal + tax, 2);
    return this;
  }
}
