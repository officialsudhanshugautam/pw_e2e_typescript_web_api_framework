
//Credit Card

//Test cases:

//Positive
// length credit number
// Security digit
// UI of Credit card
// Authorization of valid credit card
// Size of the credit card
// Blank credit card
// Transaction on the credit limit within the limit
// Notification while any transaction
// Setting apply time than using credit card
// billing cycle 
//

//Negative
// Missing or less length of credit card number
// Validating authorization of wrong details
// Not exposing sensitive information 
// Direction of inserting credit card
// Same name but two different credit card number
// Same credit card number validation

//Edge
// Credit number is blocked from DB still using for authorization
// Expiry date and time checks 
// Credit Amount is reached limit
// Transaction on international merchant but it's blocked from card setting 
// Transaction on exceeding credit limit
//



// Validating authorization of wrong details

import { expect, test } from '@playwright/test';

test.skip('Checking Authorization with Wrond Credentials Details', async ( { page }) => {

    await page.goto('https://creditcardauthorization/user');

    await page.getByRole('textbox', { name: 'enter username'}).fill('sudhanshu');
    await page.getByRole('textbox', {name: 'enter password'}).fill('wrongcredentials@123');
    await page.getByRole('button', {name: 'login'}).click();

    let message = await page.getByRole('textbox', {name: 'Unauthorized credit card'}).all();


    expect(message).toBe('Unauthorized credit card');


});


// More than 500 tcs
// 350 got failed

// report CI/CD 
// checkout erro emssage
// number of test case or check spec file which spec is getting fail
//checkout out local repo
// chekcing spec file
// if it's running in my local repo
// secrects variable
// if not not running in local repo
// chekcing my previous merge
// checking which newly feature is added in my repo
