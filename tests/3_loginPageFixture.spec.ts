
import { test, expect } from '../src/fixtures/1_pageFixtures';

import { CsvHelper } from '../src/utils/CsvHelper';

//import { ExcelHelper } from '../src/utils/ExcelHelper';

import { JsonHelper } from '../src/utils/JsonHelper';

test.beforeEach(async ({ loginPage }) => {

    await loginPage.goToLoginPage();

});
test('login page title test', async ({ loginPage }) => {

    let pageTitle = await loginPage.getLoginPageTitle();
    console.log('Login Page Title: ', pageTitle);
    expect(pageTitle).toBe('Account Login');

});

//base page:
test('login page title test from BASE PAGE', async ({ loginPage }) => {

    let pageTitle = await loginPage.getPageTitle();
    console.log('Login Page Title: ', pageTitle);
    expect(pageTitle).toBe('Account Login');

});

test('forgot pwd link exist test', async ({ loginPage }) => {

    expect(await loginPage.isForgettenPwdLinkExist()).toBeTruthy();
    
});

test('user is able to login to app with valid credentials', async ({ loginPage, homePage }) => {

    await loginPage.doLogin(process.env.USERNAME, process.env.PASSWORD);
    expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

//DD_0: By using Test Data from Fixtures

test(`login to app with invalid credentials with Fixture Data`, async ({ loginPage, testData }) => {

    //one by one | run sequetionally
    for (let row of testData) {
    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();

    }

});

//Csv file
//pros
//1. light weight, easy to maintain/read
//2. 3rd party library, no need of license
//3. using fs object
//4. good for large set of test data
//Data Driven Test 1: read CSV data directly from the CSV file and loop the test method row wise...

let testCSVData = CsvHelper.readCsv('src/testdata/logindata.csv');
for(let row of testCSVData) {
test(`login to app with invalid credentials - ${row.username} - ${row.password}`, async ({ loginPage, homePage }) => {

    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();

});
}

//Excel file
//cons:
//1. maintenance of the excel file is not easy
//2. MS License limitation --> because it required MS Office installation which usually not have respective system
//3. excel file get corrupted
//Data Driven Test 2: read xlsx data directly from the Excel file and loop the test method row wise...
//not workding due to MS Office not present in this MAC system

// let testExcelData = ExcelHelper.readExcel('src/testdata/opencarttestdata.xlsx', 'login');
// for(let row of testExcelData) {
// test(`login to app with invalid credentials with Excel Data - ${row.username} - ${row.password}`, async ({ loginPage, homePage }) => {

//     await loginPage.doLogin(row.username, row.password);
//     expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();

// });
// }

//JSON file
//pros:
//1. inbuilt method: parse, lightweight, smaller data data soource, best to use of this
//Data Driven Test 3: read JSON data directly from the JSON file and loop the test method row wise...

let testJSONData = JsonHelper.readJSON('src/testdata/logindata.json');
for(let row of testJSONData) {
test(`login to app with invalid credentials with JSON Data - ${row.username} - ${row.password}`, async ({ loginPage }) => {

    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();

});
}


//common features test:
test('APP logo exists on Login Page from Base Page', async ({ basePage }) => {

    expect(await basePage.isLogoVisible()).toBeTruthy();
});

test('@smoke Search Box exist on Login Page', async ({ basePage }) => {

    expect(await basePage.isSearchBoxVisible()).toBeTruthy();
});
test('Cart exist on Login Page', async ({ basePage }) => {

    expect(await basePage.isCartButtonVisible()).toBeTruthy();
});

test('Footer exists on Login Page', async ({ basePage }) => {

    expect(await basePage.getPageFootersCount()).toBe(16);
});