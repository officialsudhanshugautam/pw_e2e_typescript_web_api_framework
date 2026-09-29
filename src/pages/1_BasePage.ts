import { Locator, Page } from "@playwright/test";


export class BasePage {

    protected readonly page: Page;

    //locators
    //common locators accross all pages:
    protected readonly logo: Locator;
    protected readonly searchBoxx: Locator;
    protected readonly searchIconn: Locator;
    protected readonly footerLinks: Locator;
    protected readonly currency: Locator;
    protected readonly cartButton: Locator;

    //initializations
    constructor(page: Page) {

        this.page = page;
        this.logo = page.getByRole('img', { name: 'naveenopencart' });
        this.searchBoxx = page.getByRole('textbox', { name: 'Search' });
        this.searchIconn = page.locator('div#search button');
        this.currency = page.locator('#form-currency');
        this.cartButton = page.locator('#cart button');
        this.footerLinks = page.locator('footer a');

    }

    //actions
    //App common methods: footer, logo

    async isLogoVisible(): Promise<boolean> {
        return await this.logo.isVisible();
    }

    async isSearchBoxVisible(): Promise<boolean> {
        return await this.searchBoxx.isVisible();
    }

    async isCurrencyVisible(): Promise<boolean> {
        return await this.currency.isVisible();
    }

    async isCartButtonVisible(): Promise<boolean> {
        return await this.cartButton.isVisible();
    }

    async getPageFootersCount(): Promise<number> {
        return await this.footerLinks.count();
    }

    async getPageFooters(): Promise<string[]> {
        return await this.footerLinks.allInnerTexts();
    }

    //page level generic methods:

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

        getPageCurrentURL(): string {
        return this.page.url();
    }

        async waitForPageLoad() {
        await this.page.waitForLoadState('load');
    }

        async takeScreenshot(name: string) {
        await this.page.screenshot({
            fullPage: true,
            path: `reports/screenshot/${name}.png`
        });
    }

}