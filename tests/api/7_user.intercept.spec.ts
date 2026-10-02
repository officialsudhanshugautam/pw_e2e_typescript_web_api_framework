//intercept : what's happening in the background as network calls
//web app --> intercept the network calls and log them.........
//'**/*' called wildcard patterns for URLs

import { test, expect } from '@playwright/test';

test('@smoke intercept and log requests', async ({ page }) => {


    //routing listener
    page.route('**/*', async (route) => {

        console.log(route.request().method(), route.request().url());
        await route.continue(); //url1 --> capture, url2 --> capture.....
    })

    //navigate to web page:
    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=common/home');

});

//intercept with mocking:
//mocking: fake data/response:

test('@smoke Mock Search Page with fake JSON', async ({ page }) => {

    let fakeProduct = [
        { name: 'Fake Macbook Pro', price: '$599' },
        { name: 'Fake Iphone 18', price: '$299' }
    ];

    //https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook
    await page.route('**/index.php?route=product/search&search=macbook', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(fakeProduct)
        });
    });

    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook');

    // await page.pause();

});

test('@smoke Mock Search Page with fake HTML', async ({ page }) => {

    await page.route('**/index.php?route=product/search&search=macbook', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'text/html',
            body: `
                <html>
                <body>
                    <h1>Search Results</h1 >
                    <div class="product-layout">
                         <h4><a href="#">Fake MacBook Pro</a></h4 >
                        <p class="price">$599</p>
                </div>
                <div class= "product-layout">
                        <h4><a href="#">Fake iPhone 19</a></h4 >
                         <p class="price">$199</p>
                    </div>
                </body>
                </html>
            `
        });
    });

    await page.goto('https://naveenautomationlabs.com/opencart/index.php?route=product/search&search=macbook');

    // now assert on the fake HTML
    const heading = await page.textContent('h1');
    expect(heading).toBe('Search Results');

    const product = await page.locator('.product-layout h4').allTextContents();
    expect(product).toEqual(["Fake MacBook Pro", "Fake iPhone 19"]);

    const price = await page.locator('.price').allTextContents();
    expect(price).toEqual(["$599", "$199"]);

    // await page.pause();

});
