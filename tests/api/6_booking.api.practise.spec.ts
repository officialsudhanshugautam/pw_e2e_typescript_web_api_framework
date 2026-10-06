import { test, expect } from '../../src/fixtures/2_apiFixtures';

let tokenID: string;

test.beforeEach('generate the token', async ({ request }) => {

    let credentials = {
        "username": `${process.env.RESTFUL_USERNAME}`,
        "password": `${process.env.RESTFUL_PASSWORD}`
    }

    let authResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
        headers: { 'Content-Type': 'application/json' },
        data: credentials
    });

    expect(authResponse.status()).toBe(200);

    let jsonResponse = await authResponse.json();
    console.log('Auth API Response: ', jsonResponse);

    tokenID = jsonResponse.token;

    console.log('Token ID: ', tokenID);

});

test('Booking CRUD with token', async ({ request }) => {

    //1. create a new booking: POST -- no token needed

    let bookingResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
        headers: { 'Content-Type': 'application/json' },
        data: {
            "firstname": "James",
            "lastname": "Brown",
            "totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Breakfast"
        }
    })

    expect(bookingResponse.status()).toBe(200);

    let bookingJSON = await bookingResponse.json();
    let bookingID = bookingJSON.bookingid;
    console.log('Booking ID: ', bookingID);

    //web automation code:
    // await page.goto('');


    //2. Update a booking ID: need token

    let updatedResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: { Cookie: `token=${tokenID}` },
        data: {
            "firstname": "James",
            "lastname": "Brown",
            "totalprice": 123,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2018-01-01",
                "checkout": "2019-01-01"
            },
            "additionalneeds": "Lunch"
        }
    })

    expect(updatedResponse.status()).toBe(200);
    expect((await updatedResponse.json()).additionalneeds).toBe('Lunch');

    //3. Delete a booking by booking ID: need token

    let deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${bookingID}`, {
        headers: { Cookie: `token=${tokenID}` }
    })

    expect(deleteResponse.status()).toBe(201);

});
