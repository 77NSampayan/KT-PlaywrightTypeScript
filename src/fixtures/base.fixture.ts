import { test as base } from '@playwright/test';
import { Logger } from '@utils/logger-util';
import { LoginPage } from '@pages/login.page';
import { SuperAdminPage } from 'src/pages/admin/superadmin.pages';

// Define types for our custom fixtures
export type TestFixtures = {
  logger: Logger;
  loginPage: LoginPage;
  superAdminPage: SuperAdminPage;
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
  loginPage: async({ page, logger }, use) => {
    const loginPage = new LoginPage(page, logger);
    await use(loginPage);
  },

  superAdminPage: async({ page, logger }, use) => {
    const superAdminPage = new SuperAdminPage(page, logger);
    await use(superAdminPage);
  }

  // navigation: async ({ page, logger }, use) => {
  //   const navigation = new Navigation(page, logger);
  //   await use(navigation);
  // },

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
