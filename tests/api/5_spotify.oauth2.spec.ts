import { test, expect } from '@playwright/test';

let OAUTH_CONFIG = {
    tokenURL : 'https://accounts.spotify.com/api/token',
    clientId: process.env.OAUTH_CLIENT_ID!,
    clientSecret: process.env.OAUTH_CLIENT_SECRET!,
    grantType: process.env.GRANT_TYPE!
}

let accessToken: string;

test.beforeEach('POST -- Generate the Access Token', async ({ request }) => {

    let postResponse = await request.post(OAUTH_CONFIG.tokenURL, {
        form: {
            grant_type: OAUTH_CONFIG.grantType,
            client_id: OAUTH_CONFIG.clientId,
            client_secret: OAUTH_CONFIG.clientSecret
        }
    })

    expect(postResponse.status()).toBe(200);

    let jsonResponse = await postResponse.json();
    // console.log('Token API Response: ', jsonResponse);

    accessToken = jsonResponse.access_token;
    // console.log('Access Token: ', accessToken);

});

test('Get albums data test', async ({ request }) => {

    let baseURL = 'https://api.spotify.com/';
    let endPointURL = '/v1/albums/4aawyAB9vmqN3uQ7FjRGTy';
    
    let albumResponse = await request.get(`${baseURL}${endPointURL}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })

    console.log(albumResponse.status());
    console.log(albumResponse.statusText());

    expect(albumResponse.status()).toBe(200); //200

    let jsonAlbumResponse = await albumResponse.json();

    console.log(jsonAlbumResponse);
    console.log(jsonAlbumResponse.album_type);
    console.log(jsonAlbumResponse.total_tracks);
    console.log(jsonAlbumResponse.external_urls.spotify);
    console.log(jsonAlbumResponse.images.length);
    // expect(jsonAlbumResponse.images.length).toBe(3);

    // expect(albumResponse.status()).toBe(403); //403 as Forbidden

});
