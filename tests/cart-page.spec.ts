import { test } from '@fixtures/base.fixture';
import { SauceDemoUsers } from '@constants/sauce-demo-users.constants';
import { SauceDemoProducts } from '@constants/sauce-demo-products.constants';

test.beforeEach(async ({ sauceDemoLoginPage, sauceDemoInventoryPage, logger }) => {
    await logger.info("Start of BeforeEach");
    await sauceDemoLoginPage.navigateToSauceDemoLoginPage({ timeout: 1000 * 30 });
    await sauceDemoLoginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);
    await sauceDemoInventoryPage.addProductToCart(SauceDemoProducts.backpack);
    await sauceDemoInventoryPage.addProductToCart(SauceDemoProducts.bikeLight);
    await sauceDemoInventoryPage.openCart();
    await logger.info("End of BeforeEach");
})

test.describe('Sauce Demo - Cart Page', () => {
    test('TC_CP_0001 - Verify added products appear in the cart with the correct item count', { tag: ['@regression', '@cart'] }, async ({ sauceDemoCartPage }) => {
        await sauceDemoCartPage.expectItemCount(2);
        await sauceDemoCartPage.expectProductInCart(SauceDemoProducts.backpack);
        await sauceDemoCartPage.expectProductInCart(SauceDemoProducts.bikeLight);
    });

    test('TC_CP_0002 - Verify removing an item from the cart page updates the cart', { tag: ['@regression', '@cart'] }, async ({ sauceDemoCartPage }) => {
        await sauceDemoCartPage.removeProduct(SauceDemoProducts.bikeLight);
        await sauceDemoCartPage.expectItemCount(1);
        await sauceDemoCartPage.expectProductNotInCart(SauceDemoProducts.bikeLight);
        await sauceDemoCartPage.expectProductInCart(SauceDemoProducts.backpack);
    });

    test('TC_CP_0003 - Verify Continue Shopping returns to the Products page', { tag: ['@regression', '@cart'] }, async ({ sauceDemoCartPage, sauceDemoInventoryPage }) => {
        await sauceDemoCartPage.continueShopping();
        await sauceDemoInventoryPage.expectLandedInInventoryPage();
    });

    test('TC_CP_0004 - Verify Checkout navigates to the checkout information page', { tag: ['@regression', '@cart'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.expectToHaveURL(/checkout-step-one\.html/);
    });
})
