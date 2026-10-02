import { test, expect } from '../../src/fixtures/2_apiFixtures';

const TOKEN = process.env.API_TOKEN;

let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
}

let userId: number;

//base URL + endpoint
//https://gorest.co.in + /public/v2/users

//sequential mode so that's why we used "serial"
//get all users
//post --> userId 123
//get /userId 123
//put /userId 123
//delete /userId 123

test.describe.serial('running e2e gorest CRUD APIs Test', () => {

    //GET Test:
    test('GET API - get all users', async ({ apiHelper }) => {

        let response = await apiHelper.getAPI('/public/v2/users', AUTH_HEADER);
        
        expect(response.status).toBe(200);
        expect(response.body.length).toBeGreaterThan(0);

    });

    //POST Test:
    test('POST API - create a user', async ({ apiHelper }) => {

        //User JS Object:
        let userData = {
            name: 'SG',
            email: `pwautomation_${Date.now()}@sudhanshu.com`,
            gender: 'male',
            status: 'active'

        }

        let response = await apiHelper.postAPI('/public/v2/users', userData, AUTH_HEADER);

        expect(response.status).toBe(201);

        userId = response.body.id;

        console.log('created user id: ', userId);

    });

    //PUT Test:
    test('PUT API - update a user', async ({ apiHelper }) => {

        //Update User JS Object:
        let userData = {
            name: 'SG',
            email: `pwautomation@sudhanshu.com`,
            gender: 'female',
            status: 'inactive'

        }

        let response = await apiHelper.putAPI(`/public/v2/users/${userId}`, userData, AUTH_HEADER);
        
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(userData.name);
        expect(response.body.status).toBe(userData.status);

    });

    //DELETE Test:
    test('DELETE API - delete a user', async ({ apiHelper }) => {

        let response = await apiHelper.deleteAPI(`/public/v2/users/${userId}`, AUTH_HEADER);
        
        expect(response.status).toBe(204);

    });

    //For Verification GET Test:
    test('GET API - Verification Deleted or Not', async ({ apiHelper }) => {

        let response = await apiHelper.getAPI(`/public/v2/users/${userId}`, AUTH_HEADER);
        
        expect(response.status).toBe(404); // Not Found

    });

});