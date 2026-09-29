

//schema: type of response data
//ajv --> node js for the schema validation
//npm install ajv

import Ajv from 'ajv';
import { test, expect } from '../../src/fixtures/2_apiFixtures';
import fs from 'fs';

const TOKEN = process.env.API_TOKEN;

let AUTH_HEADER = {
    Authorization: `Bearer ${TOKEN}`
}

//setup the AJV:
let ajv = new Ajv();

//define the JSON Schema
// let userSchema = {
//     "type": "object",
//     "properties": {
//         "id": {
//             "type": "number"
//         },
//         "name": {
//             "type": "string"
//         },
//         "email": {
//             "type": "string"
//         },
//         "gender": {
//             "type": "string"
//         },
//         "status": {
//             "type": "string"
//         }
//     },
//     "required": [
//         "id",
//         "name",
//         "email",
//         "gender",
//         "status"
//     ]
// }

let userArraySchema = {
  "type": "array",
  "items": JSON.parse(fs.readFileSync('./src/schema/userschema.json', 'utf-8'))
}

test('Get a user - Schema Test', async ({ apiHelper }) => {

    //User JS Object:
    let userData = {
        name: 'Sudhanshu Gautam',
        email: `pwautomation_${Date.now()}@sudhanshu.com`,
        gender: 'female',
        status: 'active'

    }

    let postResponse = await apiHelper.postAPI('/public/v2/users', userData, AUTH_HEADER);
    
    expect(postResponse.status).toBe(201);

    let userId = postResponse.body.id;
    console.log('created user id: ', userId);

    //get a user:
    let getResponse = await apiHelper.getAPI(`/public/v2/users/${userId}`, AUTH_HEADER);
    
    expect(getResponse.status).toBe(200);

    //verify response schema:
    // let validate = ajv.compile(userSchema);
    let validate = ajv.compile(JSON.parse(fs.readFileSync('./src/schema/userschema.json', 'utf-8')));
    let isSchemaValid = validate(getResponse.body);
    if (!isSchemaValid) {
        console.log('SCHEMA ERRORS: ', validate.errors);
    }

    expect(isSchemaValid).toBeTruthy();

});

test('Get all users - Schema Test', async ({ apiHelper }) => {

    //get all user:
    let getResponse = await apiHelper.getAPI(`/public/v2/users`, AUTH_HEADER);

    expect(getResponse.status).toBe(200);

    //verify response schema:
    let validate = ajv.compile(userArraySchema);
    let isSchemaValid = validate(getResponse.body);
    if (!isSchemaValid) {
        console.log('SCHEMA ERRORS: ', validate.errors);
    }

    expect(isSchemaValid).toBeTruthy();

});