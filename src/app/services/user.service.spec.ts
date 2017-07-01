import {  async, TestBed, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
	Http,
	HttpModule,
	BaseRequestOptions,
	Response,
	ResponseOptions,
	RequestOptions
} from '@angular/http';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';
// import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { AuthHttp } from 'angular2-jwt';

// import { IonicModule, Platform } from 'ionic-angular';
import { UserService } from './user.service';
import { Mocks, AuthHttpServiceFactoryMock } from '../../../test-config/mocks-ionic';

describe('User service', () => {
	let subject: UserService = null;
	let backend: MockBackend;
	let responseForm = '<form />';

	let tokenUrl: string = 'https://porcupine.au.auth0.com/oauth/token';
	let apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	let authOId: string = '594c8b1cc3954a4865ef9bc9';

	// async beforeEach (to allow external templates to be compiled)
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [HttpModule],
			providers: [
				UserService,
				MockBackend,
				BaseRequestOptions,
				{
					provide: Http,
					useFactory: (mockBackend, defaultOptions) => {
						return new Http(mockBackend, defaultOptions);
					},
					deps: [MockBackend, BaseRequestOptions]
				},
				{ provide: AuthHttp, useFactory: AuthHttpServiceFactoryMock, deps: [Http, RequestOptions] },
			]
		}).compileComponents();
	}));

	beforeEach(inject([UserService, MockBackend], (userService, mockBackend) => {
		subject = userService;
		backend = mockBackend;
	}));

	describe('Getting user', () => {
		it('should get user with authOId', (done) => {
			spyOn<UserService>(subject, 'getReqOptions').and.returnValue(Promise.resolve(new RequestOptions()));
			spyOn<UserService>(subject, 'processIntoUser');

			backend.connections.subscribe((connection: MockConnection) => {
				// check #GETUserById
				expect(connection.request.url).toEqual(`${apiUrl}/user?authOId=${authOId}`, 'Wrong url/ AuthOId');

				// return fake response to user GET, passes to #processIntoUser
				let options = new ResponseOptions({
					status: 200,
					body: JSON.stringify(Mocks.UserJSON),
					url: `${apiUrl}/user?authOId=${authOId}`
				});
				connection.mockRespond(new Response(options));
				expect(connection.response).toBeTruthy();

				//expect(subject.processIntoUser).toHaveBeenCalledWith(new Response(options));
			});

			subject
				.getUser(authOId)
				.then((response) => {
					//expect(response).toEqual(Mocks.User);
					done();
				});
		});
	});
});
