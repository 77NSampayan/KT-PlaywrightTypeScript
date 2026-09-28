import { test } from '@fixtures/base.fixture';
import { SauceDemoUsers } from '@constants/sauce-demo-users.constants';
import { SauceDemoProducts } from '@constants/sauce-demo-products.constants';

test.beforeEach(async ({ sauceDemoLoginPage, logger }) => {
    await logger.info("Start of BeforeEach");
    await sauceDemoLoginPage.navigateToSauceDemoLoginPage({ timeout: 1000 * 30 });
    await sauceDemoLoginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);
    await logger.info("End of BeforeEach");
})

test.describe('Sauce Demo - Products (Inventory) Page', () => {
    test('TC_IP_0001 - Verify all products are displayed on the Products page', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.expectLandedInInventoryPage();
        await sauceDemoInventoryPage.expectItemCount(6);
    });

    test('TC_IP_0002 - Verify sorting products by Name (A to Z)', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.sortBy('az');
        await sauceDemoInventoryPage.expectProductsSortedByName('ascending');
    });

    test('TC_IP_0003 - Verify sorting products by Name (Z to A)', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.sortBy('za');
        await sauceDemoInventoryPage.expectProductsSortedByName('descending');
    });

    test('TC_IP_0004 - Verify sorting products by Price (low to high)', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.sortBy('lohi');
        await sauceDemoInventoryPage.expectProductsSortedByPrice('ascending');
    });

    test('TC_IP_0005 - Verify sorting products by Price (high to low)', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.sortBy('hilo');
        await sauceDemoInventoryPage.expectProductsSortedByPrice('descending');
    });

    test('TC_IP_0006 - Verify adding a product to the cart updates the cart badge', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.addProductToCart(SauceDemoProducts.backpack);
        await sauceDemoInventoryPage.expectCartBadgeCount(1);
    });

    test('TC_IP_0007 - Verify removing a product from the cart clears the cart badge', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.addProductToCart(SauceDemoProducts.backpack);
        await sauceDemoInventoryPage.expectCartBadgeCount(1);
        await sauceDemoInventoryPage.removeProductFromCart(SauceDemoProducts.backpack);
        await sauceDemoInventoryPage.expectCartBadgeHidden();
    });

    test('TC_IP_0008 - Verify clicking a product name navigates to its detail page', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage, sauceDemoProductDetailPage }) => {
        await sauceDemoInventoryPage.openProductDetails(SauceDemoProducts.backpack);
        await sauceDemoProductDetailPage.expectProductDetails(SauceDemoProducts.backpack, '$29.99');
    });

    test('TC_IP_0009 - Verify Reset App State empties the cart', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage }) => {
        await sauceDemoInventoryPage.addProductToCart(SauceDemoProducts.backpack);
        await sauceDemoInventoryPage.expectCartBadgeCount(1);
        await sauceDemoInventoryPage.resetAppState();
        await sauceDemoInventoryPage.expectCartBadgeHidden();
    });

    test('TC_IP_0010 - Verify Logout returns to the login page', { tag: ['@regression', '@inventory'] }, async ({ sauceDemoInventoryPage, sauceDemoLoginPage }) => {
        await sauceDemoInventoryPage.logout();
        await sauceDemoLoginPage.expectLoginPageToBeVisible();
    });
})
