import { Locator, Page } from "@playwright/test";
import { BasePage  } from "./1_BasePage";

export class HomePage extends BasePage {

    //private locators:
    private readonly logoutLink: Locator;
    private readonly headers: Locator;
    private readonly searchBox: Locator;
    private readonly searchIcon: Locator;

    //constructor of the class... init the locators:
    constructor(page: Page) {
        super(page);
        this.logoutLink = page.getByRole('link', { name: 'Logout' });
        this.headers = page.getByRole('heading', { level: 2 });
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
        this.searchIcon = page.locator('#search button');

    }

    async getHomePageTitle(): Promise<string> {
        return await this.page.title();
    }

    async isLogoutLinkExist(): Promise<boolean> {
        return await this.logoutLink.isVisible();
    }

    async getHomePageHeaders(): Promise<string[]> {
        return await this.headers.allInnerTexts();
    }

    async doSearch(searchKey: string): Promise<void> {
        console.log('search key: ', searchKey);
        await this.searchBox.fill(searchKey);
        await this.searchIcon.click();

    }

}