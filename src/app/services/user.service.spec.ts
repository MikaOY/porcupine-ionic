import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { IonicModule, Platform } from 'ionic-angular';
import { TodoService } from '../../app/services/todo.service';
import { Mocks, NavParamsMock } from '../../../test-config/mocks-ionic';

describe('Todos page', () => {
	let tServ;
	let todoServiceStub = {
		slothGetCurrentBoard() {
			return Promise.resolve(Mocks.Board);
		}
	};

	// async beforeEach (to allow external templates to be compiled)
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [],
			// NO! Don't provide the real service!
			// providers:    [ UserService ]  
			// Provide a test-double instead
			providers: [
				{ provide: TodoService, useValue: todoServiceStub }
			]
		})
			// compile template and css
			// NOTE: DO NOT config TestBed after method below
			.compileComponents();
	}));

	// synchronous beforeEach (waits for async beforeEach above to complete)
	beforeEach(() => {
		tServ = TestBed.get(TodoService);
	});
});