// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
	production: false,
	apiUrl: 'http://localhost:3000',//http://porcupine-dope-api.azurewebsites.net',
	tokenUrl: 'https://porcupine.au.auth0.com/oauth/token',
	tokenReqBody: '{"client_id":"6SH0ceK2xnoSlkfMbl2rv0ZHp7szmLJr","client_secret":"BiBHTw-8w0VbbQXCE8PgXU3o8ptwk1wudE3fkAYQ3dbn-cdDR8VoCdZU5fmuNo-K","audience":"http://porcupine-dope-api.azurewebsites.net","grant_type":"client_credentials"}',
	dummyAuthOId: '594c8b1cc3954a4865ef9bc9'
};
