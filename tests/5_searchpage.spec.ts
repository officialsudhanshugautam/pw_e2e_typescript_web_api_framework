import { test, expect } from '../src/fixtures/1_pageFixtures';
import { CsvHelper } from '../src/utils/CsvHelper';


test.beforeEach(async ({ loginPage }) => {

    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.USERNAME, process.env.PASSWORD);

});

test('@sanity verify search', async ({ homePage, searchResultsPage}) => {

    await homePage.doSearch('macbook');
    let resultCount = await searchResultsPage.getProductSearchResultsCount();
    console.log('Search Result Count: ', resultCount);
    expect(resultCount).toBe(3);

});

test('@sanity verify user is able to land on the product page', async ({ homePage, searchResultsPage, page }) => {

    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    expect(await page.title()).toBe('MacBook Pro');

});

//data provider:
let productData = CsvHelper.readCsv('src/testdata/product.csv');
for (let row of productData) {

    test(`verify search result count -${row.searchKey} - ${row.productName}`, async ({ homePage, searchResultsPage}) => {

    await homePage.doSearch(row.searchKey);
    let actualResultCount = await searchResultsPage.getProductSearchResultsCount();
    console.log('Search Result Count: ', actualResultCount);
    expect(actualResultCount).toBe(Number(row.resultCount));

});

}

for (let row of productData) {
    test(`verify user is able to land on the product page - ${row.searchKey} - ${row.productName}`, async ({ homePage, searchResultsPage, page }) => {

    await homePage.doSearch(row.searchKey);
    await searchResultsPage.selectProduct(row.productName);
    expect(await page.title()).toBe(row.productName);

});
}