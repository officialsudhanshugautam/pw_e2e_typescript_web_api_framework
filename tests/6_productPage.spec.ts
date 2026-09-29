import { test, expect } from '../src/fixtures/1_pageFixtures';

test.beforeEach(async ({ loginPage }) => {

    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.USERNAME, process.env.PASSWORD);

});

test('verify product header', async ({ homePage, searchResultsPage, productInfoPage}) => {

    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');
    expect (await productInfoPage.getProductHeader()).toBe('MacBook Pro');
});

test('verify product images count', async ({ homePage, searchResultsPage, productInfoPage, page}) => {

    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Air');
    expect (await productInfoPage.getProductImagesCount()).toBe(4);

});

test('verify product information/ data count', async ({ homePage, searchResultsPage, productInfoPage, page }) => {

    await homePage.doSearch('macbook');
    await searchResultsPage.selectProduct('MacBook Pro');

    let actualProductInfoMap = await productInfoPage.getProductInfo();
    console.log('Actual Product Details: ', actualProductInfoMap);

    expect.soft(actualProductInfoMap.get('productHeader')).toBe('MacBook Pro');
    expect.soft(actualProductInfoMap.get('productimagescount')).toBe(4);

    expect.soft(actualProductInfoMap.get('Brand')).toBe('Apple');
    expect.soft(actualProductInfoMap.get('Product Code')).toBe('Product 18');
    expect.soft(actualProductInfoMap.get('Reward Points')).toBe('800');
    expect.soft(actualProductInfoMap.get('Availability')).toBe('Out Of Stock');

    expect.soft(actualProductInfoMap.get('Productprice')).toBe('$2,000.00');
    expect.soft(actualProductInfoMap.get('ExTaxPrice')).toBe('$2,000.00');

});

//common features test:
test('APP logo exists on Login Page from Base Page', async ({ basePage }) => {

    expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('Search Box exist on Login Page', async ({ basePage }) => {

    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
});
test('Cart exist on Login Page', async ({ basePage }) => {

    expect(await basePage.isCartButtonVisible()).toBeTruthy();
});

test('Footer exists on Login Page', async ({ basePage }) => {

    expect(await basePage.getPageFootersCount()).toBe(16);
});



