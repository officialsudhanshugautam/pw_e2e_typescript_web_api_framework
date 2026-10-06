import { test, expect, APIResponse } from "@playwright/test";

//object
let AUTH_TOKEN = {
    Authorization: `Bearer ${process.env.API_TOKEN}`
};

test('Get all users API Test', async ({ request }) => {

    let response: APIResponse = await request.get('https://gorest.co.in/public/v2/users', {
        headers: AUTH_TOKEN

    });

    // console.log(response); //with of no use of information so need to use JSON method

    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status());
    console.log(response.statusText());

    //assertion
    expect(response.status()).toBe(200);

});

test('Create a user POST API Test', async ({ request }) => {

    //User JS Object
    let userData = {
        name: 'SG',
        email: `pwautomation_${Date.now()}@sudhanshu.com`,
        gender: 'male',
        status: 'active'

    }

    //JS Object --> JSON (Serialization) | JSON.stringfy() --> Automatically happened in PW script in POST Call
    let response = await request.post('https://gorest.co.in/public/v2/users', {
        headers: AUTH_TOKEN,
        data: userData

    });

    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status()); //201
    console.log(response.statusText()); //Created

    //assertion
    expect(response.status()).toBe(201);


});

test.skip('Update a user PUT API Test', async ({ request }) => {

    //User JS Object:
    let userData = {
        name: 'SG',
        email: `pwautomation@sudhanshu.com`,
        gender: 'female',
        status: 'inactive'

    }

    let response = await request.put('https://gorest.co.in/public/v2/users/8640921', {
        headers: AUTH_TOKEN,
        data: userData

    });

    let jsonBody = await response.json();
    console.log(jsonBody);
    console.log(response.status()); //200
    console.log(response.statusText()); //OK

    //assertion
    expect(response.status()).toBe(200);


});

test.skip('Delete a user DELETE API Test', async ({ request }) => {

    let response = await request.delete('https://gorest.co.in/public/v2/users/8640921', {
        headers: AUTH_TOKEN,

    });

    console.log(response.status()); //204
    console.log(response.statusText()); //NO CONTENT

    //assertion
    expect(response.status()).toBe(204);


});

test.skip('Get a confirmation of deleted user GET API Test', async ({ request }) => {

    let response = await request.get('https://gorest.co.in/public/v2/users/8640921', {
        headers: AUTH_TOKEN
    })

    console.log(response.status()); //404
    console.log(response.statusText()); //Not Found

    //assertion
    expect(response.status()).toBe(404);

});