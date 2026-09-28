import { test } from '@fixtures/base.fixture';
import { SauceDemoUsers } from '@constants/sauce-demo-users.constants';
import { SauceDemoProducts } from '@constants/sauce-demo-products.constants';

test.beforeEach(async ({ sauceDemoLoginPage, sauceDemoInventoryPage, logger }) => {
    await logger.info("Start of BeforeEach");
    await sauceDemoLoginPage.navigateToSauceDemoLoginPage({ timeout: 1000 * 30 });
    await sauceDemoLoginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);
    await sauceDemoInventoryPage.openProductDetails(SauceDemoProducts.backpack);
    await logger.info("End of BeforeEach");
})

test.describe('Sauce Demo - Product Detail Page', () => {
    test('TC_PD_0001 - Verify product detail page shows the correct name and price', { tag: ['@regression', '@product-detail'] }, async ({ sauceDemoProductDetailPage }) => {
        await sauceDemoProductDetailPage.expectProductDetails(SauceDemoProducts.backpack, '$29.99');
        await sauceDemoProductDetailPage.expectCartButtonLabel('Add to cart');
    });

    test('TC_PD_0002 - Verify adding to cart from the detail page updates the button to Remove', { tag: ['@regression', '@product-detail'] }, async ({ sauceDemoProductDetailPage }) => {
        await sauceDemoProductDetailPage.addToCart();
        await sauceDemoProductDetailPage.expectCartButtonLabel('Remove');
    });

    test('TC_PD_0003 - Verify removing from cart on the detail page reverts the button to Add to cart', { tag: ['@regression', '@product-detail'] }, async ({ sauceDemoProductDetailPage }) => {
        await sauceDemoProductDetailPage.addToCart();
        await sauceDemoProductDetailPage.expectCartButtonLabel('Remove');
        await sauceDemoProductDetailPage.removeFromCart();
        await sauceDemoProductDetailPage.expectCartButtonLabel('Add to cart');
    });

    test('TC_PD_0004 - Verify Back to products returns to the Products page', { tag: ['@regression', '@product-detail'] }, async ({ sauceDemoProductDetailPage, sauceDemoInventoryPage }) => {
        await sauceDemoProductDetailPage.goBackToProducts();
        await sauceDemoInventoryPage.expectLandedInInventoryPage();
    });
})
