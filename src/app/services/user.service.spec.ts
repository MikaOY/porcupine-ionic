import { ComponentFixture, async, TestBed, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
	Http,
	HttpModule,
	BaseRequestOptions,
	Response,
	ResponseOptions,
	RequestMethod,
	ResponseContentType,
	RequestOptions
} from '@angular/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { environment } from '../../environments/environment';

import { IonicModule, Platform } from 'ionic-angular';
import { UserService } from './user.service';
import { Mocks, NavParamsMock, AuthHttpServiceFactoryMock } from '../../../test-config/mocks-ionic';

describe('User service', () => {
	let subject: UserService = null;
	let backend: MockBackend;
	let responseForm = '<form />';

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
			spyOn<UserService>(subject, 'processIntoUser');

			backend.connections.subscribe((connection: MockConnection) => {
				// check #GETUserById
				expect(connection.request.url).toEqual(`${environment.apiUrl}/user?authOId=${environment.dummyAuthOId}`, 'Wrong url/ AuthOId');

				// return fake response to user GET, passes to #processIntoUser
				let options = new ResponseOptions({
					status: 200,
					body: JSON.stringify(Mocks.UserJSON),
					url: `${environment.apiUrl}/user?authOId=${environment.dummyAuthOId}`
				});
				connection.mockRespond(new Response(options));
				expect(connection.response).toBeTruthy();

				//expect(subject.processIntoUser).toHaveBeenCalledWith(new Response(options));
			});

			subject
				.getUser(environment.dummyAuthOId)
				.then((response) => {
					//expect(response).toEqual(Mocks.User);
					done();
				});
		});
	});
});
