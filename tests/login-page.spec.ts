import { test } from '@fixtures/base.fixture';
import { SauceDemoUsers } from '@constants/sauce-demo-users.constants';
import { TextConstants } from '@constants/text.constants';

test.beforeEach(async ({ sauceDemoLoginPage, logger }) => {
    await logger.info("Start of BeforeEach");
    await sauceDemoLoginPage.navigateToSauceDemoLoginPage({ timeout: 1000 * 30 });
    await logger.info("End of BeforeEach");
})

test.describe('Sauce Demo - Login Page', () => {
    test('TC_LP_0001 - Verify successful login with the standard user', { tag: ['@regression', '@login'] }, async ({ sauceDemoLoginPage, sauceDemoInventoryPage }) => {
        await sauceDemoLoginPage.login(SauceDemoUsers.standard.username, SauceDemoUsers.standard.password);
        await sauceDemoInventoryPage.expectLandedInInventoryPage();
    });

    test('TC_LP_0002 - Verify the problem user can still reach the Products page', { tag: ['@regression', '@login'] }, async ({ sauceDemoLoginPage, sauceDemoInventoryPage }) => {
        await sauceDemoLoginPage.login(SauceDemoUsers.problem.username, SauceDemoUsers.problem.password);
        await sauceDemoInventoryPage.expectLandedInInventoryPage();
    });

    test('TC_LP_0003 - Verify the locked out user cannot log in', { tag: ['@regression', '@login'] }, async ({ sauceDemoLoginPage }) => {
        await sauceDemoLoginPage.login(SauceDemoUsers.lockedOut.username, SauceDemoUsers.lockedOut.password);
        await sauceDemoLoginPage.expectErrorMessageToContainText(TextConstants.SauceDemoLoginPage.lockedOutError);
    });

    test('TC_LP_0004 - Verify login fails with an invalid password', { tag: ['@regression', '@login'] }, async ({ sauceDemoLoginPage }) => {
        await sauceDemoLoginPage.login(SauceDemoUsers.standard.username, 'wrong_password');
        await sauceDemoLoginPage.expectErrorMessageToContainText(TextConstants.SauceDemoLoginPage.invalidCredentialsError);
    });

    test('TC_LP_0005 - Verify login fails when the username is missing', { tag: ['@regression', '@login'] }, async ({ sauceDemoLoginPage }) => {
        await sauceDemoLoginPage.login('', SauceDemoUsers.standard.password);
        await sauceDemoLoginPage.expectErrorMessageToContainText(TextConstants.SauceDemoLoginPage.missingUsernameError);
    });

    test('TC_LP_0006 - Verify login fails when the password is missing', { tag: ['@regression', '@login'] }, async ({ sauceDemoLoginPage }) => {
        await sauceDemoLoginPage.login(SauceDemoUsers.standard.username, '');
        await sauceDemoLoginPage.expectErrorMessageToContainText(TextConstants.SauceDemoLoginPage.missingPasswordError);
    });
})
