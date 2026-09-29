import { test, expect } from '../../src/fixtures/2_apiFixtures';

const TOKEN = process.env.API_TOKEN;

let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
}

//helper - generic method/function -- create a user (POST Call):
async function createUser(apiHelper: any) {

    //User JS Object:
    let userData = {
        name: 'Sudhanshu',
        email: `pwautomation_${Date.now()}@sudhanshu.com`,
        gender: 'male',
        status: 'active'

    }

    let response = await apiHelper.postAPI('/public/v2/users', userData, AUTH_HEADER);

    expect(response.status).toBe(201);
    return response.body;

}

//Test 1: Create a user test + verify: AAA
//POST --> userID --> GET /userID --> verify

test('Create a user test', async ({ apiHelper }) => {

    //1. POST --> create a user:
    let userResponse = await createUser(apiHelper);

    //2. GET --> get a user:
    let getResponse = await apiHelper.getAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body.name).toBe('Sudhanshu');

});

//Test 2: Create a user test + verify: AAA
//POST --> userID --> GET /userID --> PUT /userID --> GET /userID --> verify

test('Update a user test', async ({ apiHelper }) => {

    //1. POST --> create a user:
    let userResponse = await createUser(apiHelper);

    //2. GET --> get a user:
    let getResponse = await apiHelper.getAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);

    //3. PUT --> update a user:
    //Update User JS Object:
    let userUpdatedData = {
        name: 'SG-Update',
        status: 'inactive'

    }

    let response = await apiHelper.putAPI(`/public/v2/users/${userResponse.id}`, userUpdatedData, AUTH_HEADER);
    expect(response.status).toBe(200);

    expect.soft(response.body.name).toBe(userUpdatedData.name);
    expect.soft(response.body.status).toBe(userUpdatedData.status);

    //4. GET --> get a user:
    getResponse = await apiHelper.getAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect.soft(response.body.name).toBe(userUpdatedData.name);
    expect.soft(response.body.status).toBe(userUpdatedData.status);
});

//Test 3: Delete a user test + verify: AAA
//POST --> userID --> GET /userID --> DELETE /userID (204) --> GET /userID (404) --> verify

test('Delete a user test', async ({ apiHelper }) => {

    //1. POST --> create a user:
    let userResponse = await createUser(apiHelper);

    //2. GET --> get a user:
    let getResponse = await apiHelper.getAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);

    //3. DELETE --> delete a user:
    let response = await apiHelper.deleteAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(response.status).toBe(204);

    //4. GET --> confirm a user is deleted or not:
    getResponse = await apiHelper.getAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body.message).toBe('Resource not found');

});

//Test 4: Partial update a user test + verify: AAA
//POST --> userID --> GET /userID --> PATCH /userID --> GET /userID --> verify

test('Partial update a user test', async ({ apiHelper }) => {

    //1. POST --> create a user:
    let userResponse = await createUser(apiHelper);

    //2. GET --> get a user:
    let getResponse = await apiHelper.getAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);

    //3. PATCH --> partial update a user:
    //Update User JS Object:
    let userUpdatedData = {
        name: 'SG-Partial-Update',
        status: 'inactive'

    }

    let response = await apiHelper.patchAPI(`/public/v2/users/${userResponse.id}`, userUpdatedData, AUTH_HEADER);
    expect(response.status).toBe(200);

    expect.soft(response.body.name).toBe(userUpdatedData.name);
    expect.soft(response.body.status).toBe(userUpdatedData.status);

    //4. GET --> get a user:
    getResponse = await apiHelper.getAPI(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
    expect(getResponse.status).toBe(200);
    expect.soft(response.body.name).toBe(userUpdatedData.name);
    expect.soft(response.body.status).toBe(userUpdatedData.status);

});