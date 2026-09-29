import { APIRequestContext } from "@playwright/test";

export class ApiHelper {

    //private variables
    private readonly myrequest: APIRequestContext;
    private readonly baseURL: string;

    constructor(request: APIRequestContext, baseURL: string) {
        this.myrequest = request;
        this.baseURL = baseURL;
    }

    //helper methods:

    //GET
    async getAPI(endpoint: string, myheaders?: Record<string, string>) {

        let response = await this.myrequest.get(`${this.baseURL}${endpoint}`, {
            headers: myheaders
        });

        console.log(await response.json(), response.status());

        return {
            status: response.status(),
            body: await response.json()
        }
    }

    //POST
    async postAPI(endpoint: string, data: object, headers?: Record<string, string>) {

        let response = await this.myrequest.post(`${this.baseURL}${endpoint}`, {
            headers: headers,
            data: data
        });

        console.log(await response.json(), response.status());

        return {
            status: response.status(),
            body: await response.json()
        }
    }

    //PUT
    async putAPI(endpoint: string, data: object, headers?: Record<string, string>) {

        let response = await this.myrequest.put(`${this.baseURL}${endpoint}`, {
            headers: headers,
            data: data
        });

        console.log(await response.json(), response.status());

        return {
            status: response.status(),
            body: await response.json()
        }
    }


    //DELETE
    async deleteAPI(endpoint: string, headers?: Record<string, string>) {

        let response = await this.myrequest.delete(`${this.baseURL}${endpoint}`, {
            headers: headers,
        });

        console.log(response.status());

        return {
            status: response.status()
        }
    }

    //PATCH
    async patchAPI(endpoint: string, data: object, headers?: Record<string, string>) {

        let response = await this.myrequest.patch(`${this.baseURL}${endpoint}`, {
            headers: headers,
            data: data
        });

        console.log(response.status());

        return {
            status: response.status(),
            body: await response.json()
        }
    }

}