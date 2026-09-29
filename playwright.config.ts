import { defineConfig, devices } from '@playwright/test';
import { configDotenv } from 'dotenv';
import reportingLabs from './reporting-labs.config';

//dotenv package = environment variable | process.env
//npm install dotenv
//ENV=qa npx playwright test or by default given below as or operator
const ENV = process.env.ENV || "qa";
console.log('Running tests on Environment: ', ENV);
configDotenv({ path: `config/.env.${ENV}` });

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 2 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
  ? [
    ['list'],
    ['html', { outputFolder: "reports/html-report", open: "never"}],
    ["allure-playwright", {
      outputFolder: "allure-results",
      suiteTitle: true
    }],
    ['reporting-labs', reportingLabs],
  ]
  :
  [
    ['list'],
    ['html', { outputFolder: "reports/html-report", open: "never"}],
    ["allure-playwright", {
      outputFolder: "allure-results",
      suiteTitle: true
    }],
    ['reporting-labs', reportingLabs],
  ],
  use: {
    baseURL: process.env.BASE_URL,
    headless: !process.env.CI ? false : true,
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

});
