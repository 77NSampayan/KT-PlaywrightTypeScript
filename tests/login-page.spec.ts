import { test } from '@fixtures/base.fixture';
import { superAdminCredentials } from 'playwright.config'

test.beforeEach(async ({loginPage, logger}) => {
    await logger.info("Start of BeforeEach");
    await loginPage.navigateToAppLoginPage(undefined, { timeout: 1000 * 30 });
    await logger.info("End of BeforeEach");
})

test.describe('Admin Page', () => {
    test('TC_AP_0001 - Verify Main Page screen of 77QA QA tool ', { tag: ['@regression', '@admin'] }, async ({ loginPage, superAdminPage }) => {
        await loginPage.login(superAdminCredentials.username, superAdminCredentials.password);
        await superAdminPage.expectLandedInAdminDashboard();
    });
})
