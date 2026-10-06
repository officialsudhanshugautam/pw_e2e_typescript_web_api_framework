import {test, expect} from '@playwright/test';

import {LoginPage} from '../src/pages/2_LoginPage';
import { HomePage } from '../src/pages/3_HomePage';
import { log, meta } from 'reporting-labs';
// import * as allure from "allure-js-commons";

let loginPage: LoginPage;
let homePage: HomePage;

// test.beforeEach(async ({ page }) => {
//     loginPage = new LoginPage(page);
//     await loginPage.goToLoginPage();
//     homePage = new HomePage(page);
// });

//AAA - Arrange Act Action
test('@smoke login page title test', async ({ page }) => {

    //reporting labs
    meta({priority: 'P2', severity: 'Minor', owner: 'Sudhanshu Gautam', story: 'PW-Story-101', epic: 'PW-Epic-101', feature: '101', issue: 'PW-Bug-101' });

    loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();

    //allure
    // await allure.suite("Login Tests");
    // await allure.severity("Critical");
    // await allure.feature("Authentication");
    // await allure.story("Valid Login");
    // await allure.descriptions("Verify User Can Login with Valid Credentials");

    // await allure.step("Verify Page Title", async () => {
    let pageTitle = await loginPage.getLoginPageTitle();
    console.log('Login Page Title: ', pageTitle);

    //reporting labs
    await log('Login Page Title: ', pageTitle);

    expect(pageTitle).toBe('Account Login');
// });
});

test('@smoke forgot pwd link exist test', async ({ page }) => {

    //reporting labs
    meta({priority: 'P1', severity: 'Major', owner: 'Priyanka Yadav', story: 'PW-Story-102', epic: 'PW-Epic-102', feature: '102', issue: 'PW-Bug-102' });

    loginPage = new LoginPage(page);
    await loginPage.goToLoginPage();
    expect(await loginPage.isForgettenPwdLinkExist()).toBeTruthy();
    
});

test('@smoke user is able to login to app', async ({ page }) => {

    //reporting labs
    meta({priority: 'P3', severity: 'Critical', owner: 'Hinaya Gautam', story: 'PW-Story-103', epic: 'PW-Epic-103', feature: '103', issue: 'PW-Bug-103' });

    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await loginPage.goToLoginPage();
    await loginPage.doLogin(process.env.USERNAME, process.env.PASSWORD);
    expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});