import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import {NavParams} from 'ionic-angular';
import { IonicModule, Platform } from 'ionic-angular';

import { TodosPage } from './todos';
import { TodoList } from './todo-list/todo-list.component';
import { SideMenu } from '../side-menu/side-menu.component';
import { ProfilePage } from '../side-menu/profile/profile.component';
import { TodoService } from '../../app/services/todo.service';
import { Mocks, NavParamsMock } from '../../../test-config/mocks-ionic';

describe('Todos page', () => {
	let comp: TodosPage;
	let fixture: ComponentFixture<TodosPage>;
	let todoService;
	// stub must have props and methods used in testing, but is NOT used
	let todoServiceStub = {
		slothGetCurrentBoard() {
			return Mocks.Board;
		}
	};

	// async beforeEach (to allow external templates to be compiled)
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TodosPage, TodoList, SideMenu, ProfilePage],
			imports: [
				IonicModule.forRoot(TodosPage),
				IonicModule.forRoot(TodoList),
				IonicModule.forRoot(SideMenu),
				IonicModule.forRoot(ProfilePage),
			],
			// NO! Don't provide the real service!
			// providers:    [ UserService ]  
			// Provide a test-double instead
			providers: [
				{ provide: TodoService, useValue: todoServiceStub },
				{provide: NavParams, useClass: NavParamsMock}
			]
		})
			// compile template and css
			// NOTE: DO NOT config TestBed after method below
			.compileComponents();
	}));

	// synchronous beforeEach (waits for async beforeEach above to complete)
	beforeEach(() => {
		fixture = TestBed.createComponent(TodosPage);
		comp = fixture.componentInstance;

		// get todoService actually injected
		// this one is the 'service' actually used in testing
		todoService = fixture.debugElement.injector.get(TodoService);
		// also can: get todoService from the root injector
		// todoService = TestBed.get(TodoService);

		spyOn<TodosPage>(comp, 'slothCurrentBoard');
	});

	it('should be created', () => {
		expect(comp instanceof TodosPage).toBe(true);
	});

	it('should call slothCurrentBoard()', () => {
		comp.slothCurrentBoard();
		expect(comp.slothCurrentBoard).toHaveBeenCalled();
	});
});