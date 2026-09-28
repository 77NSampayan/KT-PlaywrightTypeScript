import { Locator, Page } from "@playwright/test";
import { BasePage } from "@pages/base.page";
import { Logger } from "@utils/logger-util";


export class SignUpPage extends BasePage {

    /**
     * @param page - The Playwright Page object.
     * @param logger - An instance of the Logger utility.
     */
    constructor(page: Page, logger: Logger) {
    super(page, logger);
    }

    // Locators
    private readonly titleEnterAccountInfo = this.getPage().locator(".title.text-center").filter({ hasText: "Enter Account Information" });
    // Account information
    private readonly inputFirstName: Locator = this.getPage().getByTestId("first_name");
    private readonly inputLastName: Locator = this.getPage().getByTestId("last_name");
    private readonly inputPassword: Locator = this.getPage().getByTestId("password");
    private readonly inputMobileNumber: Locator = this.getPage().getByTestId("mobile_number");
    // Address information
    private readonly inputCompany: Locator = this.getPage().getByTestId("company");
    private readonly inputAddress1: Locator = this.getPage().getByTestId("address");
    private readonly inputAddress2: Locator = this.getPage().getByTestId("address2");
    private readonly inputState: Locator = this.getPage().getByTestId("state");
    private readonly inputCity: Locator = this.getPage().getByTestId("city");
    private readonly inputZipcode: Locator = this.getPage().getByTestId("zipcode");
    // Date of birth
    private readonly dropdownDay: Locator = this.getPage().getByTestId("days");
    private readonly dropdownMonth: Locator = this.getPage().getByTestId("months");
    private readonly dropdownYear: Locator = this.getPage().getByTestId("years");
    // Country
    private readonly dropdownCountry: Locator = this.getPage().getByTestId("country");
    // Title
    private readonly radioTitleMr: Locator = this.getPage().locator("#id_gender1");
    private readonly radioTitleMrs: Locator = this.getPage().locator("#id_gender2");
    // Other options
    private readonly radioNewsLetter: Locator = this.getPage().locator("#newsletter");
    private readonly radioSpecialOffers: Locator = this.getPage().locator("#optin");
    // Buttons
    private readonly buttonCreateAccount: Locator = this.getPage().getByTestId("create-account");
    
    // --- Page-Specific Actions ---
    async clickCreateAccount(): Promise<this> {
        await this.actions.click(this.buttonCreateAccount);
        return this;
    }

    async enableNewsletter(enable: boolean = false): Promise<this> {
        if (enable === true) {
            await this.actions.check(this.radioNewsLetter);
        }
        return this;
    }

    async enableSpecialOffers(enable: boolean = false): Promise<this> {
        if (enable === true) {
            await this.actions.check(this.radioSpecialOffers);
        }
        return this;
    }

    async fillDateOfBirth(day: number, month: string, year: number): Promise<this> {
        await this.actions.selectOption(this.dropdownDay, `${day}`);
        await this.actions.selectOption(this.dropdownMonth, `${month}`);
        await this.actions.selectOption(this.dropdownYear, `${year}`);
        return this;
    }

    async fillUserInformation(firstName: string, lastName: string, company: string = ""): Promise<this> {
        await this.actions.fill(this.inputFirstName, firstName);
        await this.actions.fill(this.inputLastName, lastName);
        await this.actions.fill(this.inputCompany, company);
        return this;
    }

    async fillUserAddressInformation(address1: string, address2: string = "",
        country: "India" | "United States" | "Canada" | "Australia" | "Israel" |"New Zealand" | "Singapore",
        state: string, zipcode: string, mobile_number: string): Promise<this> {
        await this.actions.fill(this.inputAddress1, address1);
        await this.actions.fill(this.inputAddress2, address2);
        await this.actions.selectOption(this.dropdownCountry, country);
        await this.actions.fill(this.inputState, state);
        await this.actions.fill(this.inputZipcode, zipcode);
        await this.actions.fill(this.inputMobileNumber, mobile_number);
        return this;
    }

    async selectTitle(title: "Mr." | "Mrs."): Promise<this> {
        if (title === "Mr.") {
            await this.actions.click(this.radioTitleMr);
        } else {
            await this.actions.click(this.radioTitleMrs);
        }
        return this;
    }

    
}
