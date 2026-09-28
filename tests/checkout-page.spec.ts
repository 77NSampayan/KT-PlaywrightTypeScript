import { test } from '@fixtures/base.fixture';
import { SauceDemoUsers } from '@constants/sauce-demo-users.constants';
import { SauceDemoProducts } from '@constants/sauce-demo-products.constants';
import { TextConstants } from '@constants/text.constants';

test.beforeEach(async ({ sauceDemoLoginPage, sauceDemoInventoryPage, logger }) => {
    await logger.info("Start of BeforeEach");
    await sauceDemoLoginPage.navigateToSauceDemoLoginPage({ timeout: 1000 * 30 });
    await sauceDemoLoginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);
    await sauceDemoInventoryPage.addProductToCart(SauceDemoProducts.backpack);
    await sauceDemoInventoryPage.addProductToCart(SauceDemoProducts.bikeLight);
    await sauceDemoInventoryPage.openCart();
    await logger.info("End of BeforeEach");
})

test.describe('Sauce Demo - Checkout Flow', () => {
    test('TC_CO_0001 - Verify checkout fails when First Name is missing', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.submitCheckoutInformation('', 'Doe', '12345');
        await sauceDemoCheckoutStepOnePage.expectErrorMessageToContainText(TextConstants.SauceDemoCheckoutPage.missingFirstNameError);
    });

    test('TC_CO_0002 - Verify checkout fails when Last Name is missing', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.submitCheckoutInformation('John', '', '12345');
        await sauceDemoCheckoutStepOnePage.expectErrorMessageToContainText(TextConstants.SauceDemoCheckoutPage.missingLastNameError);
    });

    test('TC_CO_0003 - Verify checkout fails when Zip/Postal Code is missing', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.submitCheckoutInformation('John', 'Doe', '');
        await sauceDemoCheckoutStepOnePage.expectErrorMessageToContainText(TextConstants.SauceDemoCheckoutPage.missingPostalCodeError);
    });

    test('TC_CO_0004 - Verify Cancel on the checkout information page returns to the cart', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.cancel();
        await sauceDemoCartPage.expectToHaveURL(/cart\.html/);
        await sauceDemoCartPage.expectItemCount(2);
    });

    test('TC_CO_0005 - Verify the checkout overview shows the correct item count and total', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage, sauceDemoCheckoutStepTwoPage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.submitCheckoutInformation('John', 'Doe', '12345');
        await sauceDemoCheckoutStepTwoPage.expectItemCount(2);
        await sauceDemoCheckoutStepTwoPage.expectTotalToEqualSubtotalPlusTax();
    });

    test('TC_CO_0006 - Verify Cancel on the checkout overview returns to the Products page', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage, sauceDemoCheckoutStepTwoPage, sauceDemoInventoryPage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.submitCheckoutInformation('John', 'Doe', '12345');
        await sauceDemoCheckoutStepTwoPage.cancel();
        await sauceDemoInventoryPage.expectLandedInInventoryPage();
    });

    test('TC_CO_0007 - Verify completing checkout displays the order confirmation', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage, sauceDemoCheckoutStepTwoPage, sauceDemoCheckoutCompletePage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.submitCheckoutInformation('John', 'Doe', '12345');
        await sauceDemoCheckoutStepTwoPage.finish();
        await sauceDemoCheckoutCompletePage.expectOrderCompleted();
    });

    test('TC_CO_0008 - Verify Back Home from the order confirmation returns to an empty Products page cart', { tag: ['@regression', '@checkout'] }, async ({ sauceDemoCartPage, sauceDemoCheckoutStepOnePage, sauceDemoCheckoutStepTwoPage, sauceDemoCheckoutCompletePage, sauceDemoInventoryPage }) => {
        await sauceDemoCartPage.checkout();
        await sauceDemoCheckoutStepOnePage.submitCheckoutInformation('John', 'Doe', '12345');
        await sauceDemoCheckoutStepTwoPage.finish();
        await sauceDemoCheckoutCompletePage.backHome();
        await sauceDemoInventoryPage.expectLandedInInventoryPage();
        await sauceDemoInventoryPage.expectCartBadgeHidden();
    });
})
