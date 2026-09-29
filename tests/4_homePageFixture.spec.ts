import { test, expect } from '../src/fixtures/1_pageFixtures';

test.beforeEach(async ({ loginPage }) => {

    await loginPage.goToLoginPage();
    await loginPage.doLogin('priyanka@test.com', 'Priyanka@123');

});
test('home page title test', async ({ homePage }) => {

    let pageTitle = await homePage.getHomePageTitle();
    console.log('home page title: ', pageTitle);
    expect(pageTitle).toBe('My Account');
});

test('logout link exist test', async ({ homePage }) => {
    expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

test('home page headers exist test', async ({ homePage }) => {
    let allHeaders: string[] = await homePage.getHomePageHeaders();
    console.log('home page headers: ', allHeaders);
    expect.soft(allHeaders).toHaveLength(4);
    expect.soft(allHeaders).toEqual([
        'My Account',
        'My Orders',
        'My Affiliate Account',
        'Newsletter'
    ]);
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