import { Locator, Page } from "@playwright/test";
import { BasePage } from "./1_BasePage";

export class LoginPage extends BasePage {

    //1. private locators:   
    private readonly emailId: Locator;
    private readonly password: Locator;
    private readonly loginBtn: Locator;
    private readonly forgottenPasswordLink: Locator;
    private readonly loginErrorMessage: Locator

    //2. constructor of the page class: init the locators:
    constructor(page: Page) {
        super(page);

        this.emailId = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.password = page.getByLabel('Password');
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.forgottenPasswordLink = page.getByRole('button', { name: 'Login' }).first();
        this.loginErrorMessage = page.locator('.alert.alert-danger.alert-dismissible');

    }

    //3. public page actions(methods) / behaviour : Encapsulation
    async goToLoginPage(): Promise<void> {
        await this.page.goto('opencart/index.php?route=account/login');
    }

    async getLoginPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async isForgettenPwdLinkExist() {
        return await this.forgottenPasswordLink.isVisible();
    }

    async doLogin(username: string, password: string): Promise<void> {
        console.log(`user credentials: ${username} - ${password}`);
        await this.emailId.fill(username);
        await this.password.fill(password);
        await this.loginBtn.click();
    }

    async isInvalidLoginErrorDisplayed(): Promise<boolean> {
        return await this.loginErrorMessage.isVisible();
    }
 
};