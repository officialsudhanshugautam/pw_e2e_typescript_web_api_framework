import { test as baseTest } from '@playwright/test';
import { BasePage } from '../pages/1_BasePage';
import { LoginPage } from '../pages/2_LoginPage';
import { HomePage } from '../pages/3_HomePage';
import { SearchResultsPage } from '../pages/4_SearchResultsPage';
import { ProductInfoPage } from '../pages/5_ProductInfoPage';
import { CsvHelper } from '../utils/CsvHelper';

type pageFixtures = {

    basePage: BasePage,
    loginPage: LoginPage,
    homePage: HomePage,
    searchResultsPage: SearchResultsPage,
    productInfoPage: ProductInfoPage,
    testData: Record<string, string>[]

}

//extend the pw test: using baseTest.extend: inheritance

export let test = baseTest.extend<pageFixtures> ({

    basePage: async ({ page }, use ) => {
        let basePage = new BasePage(page);
        await use(basePage);
    },

    loginPage: async ({ page }, use) => {
        let loginPage = new LoginPage(page);
        await use(loginPage);
    },

    homePage: async ({ page }, use) => {
        let homePage = new HomePage(page);
        await use(homePage);
    },

    searchResultsPage: async ({ page }, use) => {
        let searchResultsPage = new SearchResultsPage(page);
        await use(searchResultsPage);
    },

    productInfoPage: async ({ page }, use) => {
        let productInfoPage = new ProductInfoPage(page);
        await use(productInfoPage);
    },

    //if using Test Data in Fixtures: than test case run sequentionally not parallel way
    testData: async ({ }, use) => {

        let testCSVData = CsvHelper.readCsv('src/testdata/logindata.csv');
        await use(testCSVData)
    }


});

export { expect } from '@playwright/test';