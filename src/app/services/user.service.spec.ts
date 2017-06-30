import { ComponentFixture, async, TestBed, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, ResponseContentType } from '@angular/http';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { IonicModule, Platform } from 'ionic-angular';
import { UserService } from './user.service';
import { Mocks, NavParamsMock } from '../../../test-config/mocks-ionic';

describe('User service', () => {
	let subject: UserService;
  let backend: MockBackend;
  let responseForm = '<form />';

	// async beforeEach (to allow external templates to be compiled)
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [],
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
        }
			]
		})
			// compile template and css
			// NOTE: DO NOT config TestBed after method below
			// .compileComponents();
	}));

	beforeEach(inject([UserService, MockBackend], (userService, mockBackend) => {
    subject = userService;
    backend = mockBackend;
  }));

	it('should be called with proper arguments', (done) => {
    backend.connections.subscribe((connection: MockConnection) => {
      expect(connection.request.url).toEqual('https://blacksonic.eu.auth0.com.auth0.com/usernamepassword/login');
      expect(connection.request.method).toEqual(RequestMethod.Post);
      expect(connection.request.headers.get('Content-Type')).toEqual('application/json');
      expect(connection.request.getBody()).toEqual(JSON.stringify(
        {
          username: 'blacksonic',
          password: 'secret',
          client_id: 'YOUR_CLIENT_ID'
        }, null, 2
      ));
      // expect(connection.request.detectContentType()).toEqual(ResponseContentType.Json);

      let options = new ResponseOptions({
        body: responseForm
      });

      connection.mockRespond(new Response(options));
    });
});