import { ComponentFixture, async, TestBed, addProviders, inject } from '@angular/core/testing';
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
		beforeAll(() => {

		});

		it('should #GETUserById', (done) => {
			backend.connections.subscribe((connection: MockConnection) => {
				expect(connection.request.url).toContain('http://porcupine-dope-api.azurewebsites.net/user?authOId');
				expect(connection.request.method).toEqual(RequestMethod.Get);

				let options = new ResponseOptions({
					body: JSON.stringify()
				});
				connection.mockRespond(new Response(options));
			});

			subject
				.GETUserById('594c8b1cc3954a4865ef9bc9')
				.then((response) => {
					expect(response.json()).toEqual({ success: true });
					done();
				});
		});
	});
});