import { test as base } from '@playwright/test';
import { Logger } from '@utils/logger-util';
import { SauceDemoLoginPage } from '@pages/sauce-demo/login.page';
import { SauceDemoInventoryPage } from '@pages/sauce-demo/inventory.page';
import { SauceDemoProductDetailPage } from '@pages/sauce-demo/product-detail.page';
import { SauceDemoCartPage } from '@pages/sauce-demo/cart.page';
import { SauceDemoCheckoutStepOnePage } from '@pages/sauce-demo/checkout-step-one.page';
import { SauceDemoCheckoutStepTwoPage } from '@pages/sauce-demo/checkout-step-two.page';
import { SauceDemoCheckoutCompletePage } from '@pages/sauce-demo/checkout-complete.page';

// Define types for our custom fixtures
export type TestFixtures = {
  logger: Logger;
  sauceDemoLoginPage: SauceDemoLoginPage;
  sauceDemoInventoryPage: SauceDemoInventoryPage;
  sauceDemoProductDetailPage: SauceDemoProductDetailPage;
  sauceDemoCartPage: SauceDemoCartPage;
  sauceDemoCheckoutStepOnePage: SauceDemoCheckoutStepOnePage;
  sauceDemoCheckoutStepTwoPage: SauceDemoCheckoutStepTwoPage;
  sauceDemoCheckoutCompletePage: SauceDemoCheckoutCompletePage;
  // navigation: Navigation;
  // Add other page objects here as needed, e.g., inventoryPage: InventoryPage;
};

// Extend the base test with our custom fixtures
export const test = base.extend<TestFixtures>({
  // --- Logger Fixture ---
  // This fixture provides a logger instance for each test.
  // It's created once per worker and can be shared across tests in that worker if needed,
  // but here we create a new one for each test for isolation.
  logger: async ({}, use, testInfo) => {
    const logger = new Logger(testInfo.title);
    await use(logger);
  },

  // --- Page Object Fixtures ---
  // This fixture provides an instance of the LoginPage.
  // It depends on the 'page' fixture from Playwright and our custom 'logger' fixture.
  sauceDemoLoginPage: async({ page, logger }, use) => {
    const sauceDemoLoginPage = new SauceDemoLoginPage(page, logger);
    await use(sauceDemoLoginPage);
  },

  sauceDemoInventoryPage: async({ page, logger }, use) => {
    const sauceDemoInventoryPage = new SauceDemoInventoryPage(page, logger);
    await use(sauceDemoInventoryPage);
  },

  sauceDemoProductDetailPage: async({ page, logger }, use) => {
    const sauceDemoProductDetailPage = new SauceDemoProductDetailPage(page, logger);
    await use(sauceDemoProductDetailPage);
  },

  sauceDemoCartPage: async({ page, logger }, use) => {
    const sauceDemoCartPage = new SauceDemoCartPage(page, logger);
    await use(sauceDemoCartPage);
  },

  sauceDemoCheckoutStepOnePage: async({ page, logger }, use) => {
    const sauceDemoCheckoutStepOnePage = new SauceDemoCheckoutStepOnePage(page, logger);
    await use(sauceDemoCheckoutStepOnePage);
  },

  sauceDemoCheckoutStepTwoPage: async({ page, logger }, use) => {
    const sauceDemoCheckoutStepTwoPage = new SauceDemoCheckoutStepTwoPage(page, logger);
    await use(sauceDemoCheckoutStepTwoPage);
  },

  sauceDemoCheckoutCompletePage: async({ page, logger }, use) => {
    const sauceDemoCheckoutCompletePage = new SauceDemoCheckoutCompletePage(page, logger);
    await use(sauceDemoCheckoutCompletePage);
  }

  // You can add more page object fixtures here following the same pattern.
  // Example:
  // inventoryPage: async ({ page, logger }, use) => {
  //   const { InventoryPage } = await import('@pages/inventory.page');
  //   const inventoryPage = new InventoryPage(page, logger);
  //   await use(inventoryPage);
  // },
});

// Add global test teardown logging
test.afterEach(async ({}, testInfo) => {
  console.log(`✓ Test completed: ${testInfo.title} - Playwright handles browser cleanup automatically`);
});

// Add global test teardown logging (worker level)
test.afterAll(async () => {
  console.log('🧹 All tests completed - Browser cleanup handled by Playwright');
});

// Export the expect function from Playwright for assertions in tests
export { expect } from '@playwright/test';
