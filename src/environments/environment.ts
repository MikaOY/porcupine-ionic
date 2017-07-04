// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
	production: false,
	apiUrl: 'http://localhost:3000',//http://porcupine-dope-api.azurewebsites.net',
	tokenUrl: 'https://porcupine.au.auth0.com/oauth/token',
	tokenReqBody: '{"client_id":"pBum20Ve6T5n76t05t6tue5G2MMk9I3d","client_secret":"rPjrpRg2PXHI0GZX9AZvK6HwzgBO08JR3QzpFUV-Y8y4t8nKesf-pLk_BL8e1U14","audience":"http://porcupine-dope-api.azurewebsites.net","grant_type":"client_credentials"}',
	dummyAuthOId: '594c8b1cc3954a4865ef9bc9'
};
