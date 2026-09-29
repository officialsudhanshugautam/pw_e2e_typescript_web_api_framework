//pw support UI + API
//project/framework: web UI (browser) + APIs (GET, POST, PUT DELETE)
//inbuilt fixtures: page, browser, context, ******* request(apis) *************
//request.get/post/put/delete 

//With UI and API
//test('title', ({ page, loginPage, request, apihelper}) => {
// page.gotp() --> web
// request.get() --> api
// loginPage.login() 
// apihelper.get/post()
//});

//only API
//test('GET a user by id', ({ request, apiHelper}) => {
// request.get() --> api
// apihelper.get()/post()/put()/delete()
//});

//CRUD:
//CREATE: POST
//RETRIVE: GET
//UPDATE: PUT/PATCH
//DELETE: DELETE

//PATCH: PATCH | Update a user (partial)

//Authentication:
//token: Bearer bc5104f9db0fa9d35d48813af15fe91ff06ca8682d3f40c5f2e264c321740063

//base URL + endpoint
//https://gorest.co.in + /public/v2/users

//get all users
//post -- userid 123
//get /userid 123
//put /userid 123
//delete /userid 123


//tc_1: create a user
//1. post /userid=123
//2. get /userid

//tc_2: get a user
//1. post /userid=123
//2. get /userid

//tc_3: update a user
//1. post /userid=123
//2. get /userid
//3. update /userid
//4. get /userid

//tc_4: delete a user
//1. post /userid=123
//2. get /userid
//3. delete /userid
//4. get /userid

//OAuth2.0
// Authorization: Bearer Token

//before each
//1. Generate the token: refresh token/ access token
//token api: endpoint url, form params: grant_type, client_id, client_access
//response: JSON: access_token = ewfrffuif422jknk234j3424424

//test:
//2. functional API:
//get /albums /users /products
//Header: { Authorization : Bearer access_token }

//spotify

//https://accounts.google.com/v3/signin/accountchooser?access_type=online
// &client_id=526618134448-m5v5lv11nvum2gosj6vukjsmgg6a7g2m.apps.googleusercontent.com&
// include_granted_scopes=true&prompt=select_account
// &redirect_uri=https%3A%2F%2Fapi.shapemyinterview.com%2Fapi%2Fauth%2Foauth%2Fgoogle%2Fcallback
// &response_type=code
// &scope=openid+email+profile
// &state=471407f70770ccaac15e3bfc3a5d8431934b5e1480fa9ecd38ce5f0f0b209ed2
// &dsh=S-2013158393%3A1789806380499136&o2v=2
// &service=lso&flowName=GeneralOAuthFlow&opparams=%253F
// &continue=https%3A%2F%2Faccounts.google.com
// %2Fsignin%2Foauth%2Fconsent%3Fauthuser%3Dunknown%26part
// %3DAJi8hANaSmRjr12215L7YG0hIxxAy0IDhFV7wFnyQzPhWqf-No0uLFPsQUZ2C3PA5YBQTTMjwVFoEpkyotj-LG3lMporzaIQ2VdVQiOoVSnmQcqSCqjuyu-U2cOrVs0K
// IwQH-0VSequJwMIcHSKfwv6VlXYheUfmjIUNPrdvyMJ48_bXeX_Xh1wNyvF84UR4_Ryw6zlwW2uSBUxew7LEij2n6DyyIz_QtzEkFCg7nWoyz9cJD33C-pfooza79VbmnOTQi
// WBUt0JGTANAwpCBDO43Nl89ptimSRwGTcEalbmy86hohzeWil1h8VysW47U2oGVLdDRVRm3oipqq0obVoJCKuL15b7_ZqVX5ipxs9GVxD_Wv2iEZwoFOKkyjHKS-BkJ3-ilba5IsFjfDgUAy
// ENU1CgMGqruAdkqHJrP5Tz1HBAYnrIJGQb1As_m_bWnWwO6EGq7L5Ro7PuQNtUY1J6Z6MfL4N7SEQnetPQtv81qIrs_-GnRYQE%26flowName%3DGeneralOAuthFlow%26as%3DS-2013158393
// %253A1789806380499136%26client_id%3D526618134448-m5v5lv11nvum2gosj6vukjsmgg6a7g2m.apps.googleusercontent.com%26requestPath%3D%252Fsignin%252Foauth%252Fconsent%23
// &app_domain=https%3A%2F%2Fapi.shapemyinterview.com
