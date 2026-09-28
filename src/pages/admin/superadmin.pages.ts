import { TextConstants } from "src/resource/constants/text.constants";
import { BasePage } from "../base.page";
import { Locator, Page } from "playwright";
import { Logger } from "src/utils/logger-util";
import { expect } from "playwright/test";
import { TIMEOUTS } from "src/utils/config-util";

export class SuperAdminPage extends BasePage {

    constructor(page: Page, logger: Logger) {
        super(page, logger);
    };

    private readonly adminDashboardHeader: Locator = this.getPage().locator(`//h6[text()='${TextConstants.AdminDashboardPage.header}']`);
    private readonly adminCompanyLogo: Locator = this.getPage().locator('//img[@alt="logo"]');

    // --- Page-Specific Actions ---

    // --- Page-Specific Assertions ---
    async expectLandedInAdminDashboard(): Promise<this> {
        await this.logger.info('Asserting that the landed in Admin Dashboard Page');
        await expect(this.adminDashboardHeader).toBeVisible();
        await expect(this.adminCompanyLogo).toBeVisible();
        await this.logger.info('Assertion passed: Landed in Admin Dashboard Page.');
        return this;
    };

}