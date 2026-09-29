import { expect, test } from '@playwright/test';

let firstBookingID: number;
let createdBookingID: number;
let tokenID: string;

test.beforeAll('API Health Check', async ({ request }) => {

    let getResponse = await request.get('https://restful-booker.herokuapp.com/ping');
    
    console.log('API Health Check: ', getResponse.status());

    expect(getResponse.status()).toBe(201);

});

test.describe.serial('running e2e tests for Restful Booker APIs Test', () => {
    test('GET API - Booking - GetBookingIds', async ({ request }) => {

        let getResponse = await request.get('https://restful-booker.herokuapp.com/booking', {

        });

        //console.log(getResponse);

        console.log(getResponse.status());
        console.log(getResponse.statusText());

        expect(getResponse.status()).toBe(200);
        expect(getResponse.statusText()).toBe('OK');

        let jsonGetResponse = await getResponse.json();
        console.log(jsonGetResponse);

        firstBookingID = jsonGetResponse[0].bookingid;
        console.log('Booking ID: ', firstBookingID);

    });

    test('GET API - Booking - GetBooking', async ({ request }) => {

        let getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${firstBookingID}`);

        console.log(getResponse.status());
        console.log(getResponse.statusText());

        expect(getResponse.ok()).toBeTruthy();
        expect(getResponse.status()).toBe(200);
        expect(getResponse.statusText()).toBe('OK');

        let jsonGetResponse = await getResponse.json();
        console.log(jsonGetResponse);

    });

    test('POST API - Booking - CreateBooking', async ({ request }) => {

        let createBooking = {
            "firstname": "Sudhanshu",
            "lastname": "Gautam",
            "totalprice": 111,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2027-01-01",
                "checkout": "2027-01-10"
            },
            "additionalneeds": "Breakfast"
        }

        let postResponse = await request.post('https://restful-booker.herokuapp.com/booking', {
            data: createBooking
        });

        expect(postResponse.ok()).toBeTruthy();
        expect(postResponse.status()).toBe(200);
        expect(postResponse.statusText()).toBe('OK');

        let jsonPostResponse = await postResponse.json();
        console.log(jsonPostResponse);

        createdBookingID = jsonPostResponse.bookingid;
        console.log('Created Booking ID: ', createdBookingID);

    });

    test('PUT API - Booking - UpdateBooking', async ({ request }) => {

        //For Creating Token
        let postResponse = await request.post('https://restful-booker.herokuapp.com/auth', {
            data: {
                "username": "admin",
                "password": "password123"
            }
        })

        expect(postResponse.ok()).toBeTruthy();

        let jsonPostResponse = await postResponse.json();
        console.log(jsonPostResponse);

        tokenID = jsonPostResponse.token;
        console.log('Token: ', tokenID);

        let updateBooking = {
            "firstname": "Sudhanshu",
            "lastname": "Gautam",
            "totalprice": 321,
            "depositpaid": true,
            "bookingdates": {
                "checkin": "2027-01-01",
                "checkout": "2027-01-10"
            },
            "additionalneeds": "Lunch"
        }

        let putResponse = await request.put(`https://restful-booker.herokuapp.com/booking/${createdBookingID}`, {
            headers: { Cookie: `token=${tokenID}` },
            data: updateBooking
        })

        expect(postResponse.ok()).toBeTruthy();
        expect(putResponse.status()).toBe(200);
        expect(putResponse.statusText()).toBe('OK');

        let jsonPutResponse = await putResponse.json();
        console.log(jsonPutResponse);

        expect(jsonPutResponse.totalprice).toBe(updateBooking.totalprice);
        expect(jsonPutResponse.additionalneeds).toBe(updateBooking.additionalneeds);

    });

    test('PATCH API - Booking - PartialUpdateBooking', async ({ request }) => {

        let partialBooking = {
            "firstname": "Sudhanshu James",
            "lastname": "Gautam Brown"
        }

        let patchResponse = await request.patch(`https://restful-booker.herokuapp.com/booking/${createdBookingID}`, {
            headers: { Cookie: `token=${tokenID}` },
            data: partialBooking
        })

        expect(patchResponse.ok()).toBeTruthy();
        expect(patchResponse.status()).toBe(200);
        expect(patchResponse.statusText()).toBe('OK');

        let jsonPatchResponse = await patchResponse.json();
        console.log(jsonPatchResponse);

        expect(jsonPatchResponse.firstname).toBe(partialBooking.firstname);
        expect(jsonPatchResponse.lastname).toBe(partialBooking.lastname);

    });

    test('DELETE API - Booking - DeleteBooking', async ({ request }) => {

        let deleteResponse = await request.delete(`https://restful-booker.herokuapp.com/booking/${createdBookingID}`, {
            headers: { Cookie: `token=${tokenID}` },
        })

        console.log(deleteResponse.status());
        console.log(deleteResponse.statusText());

        expect(deleteResponse.status()).toBe(201);

    });

    test('GET API - Verification Deleted or Not', async ({ request }) => {

        let getResponse = await request.get(`https://restful-booker.herokuapp.com/booking/${createdBookingID}`);

        console.log(getResponse.status());
        console.log(getResponse.statusText());

        expect(getResponse.status()).toBe(404);
        expect(getResponse.statusText()).toBe('Not Found');

    });

});