import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { AppModule } from "../../app/app.module";
import { TodosModule } from '../todos/todos.module';
import { SideMenuModule } from './side-menu.module';
import { NavParams } from 'ionic-angular';
import { Mocks, NavParamsMock } from '../../../test-config/mocks-ionic';
import { click } from '../../../test-config/index';

import { SideMenu } from './side-menu.component';
import { TodoService } from '../../app/services/todo.service';
import { Category } from '../../app/classes/category';
import { Board } from '../../app/classes/board';

let comp: SideMenu;
let fixture: ComponentFixture<SideMenu>;

let tServ;

// stub must have props and methods used in testing, but is NOT used
let todoServiceStub = {
	currentBoard: Mocks.Board,
	slothGetCurrentBoard() {
		return Promise.resolve(Mocks.Board);
	},
};

describe('SideMenu', () => {
	
	// async beforeEach (to allow external templates to be compiled)
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [AppModule, TodosModule, SideMenuModule],
			// NO! Don't provide the real service!
			// providers:    [ UserService ]  
			// Provide a test-double instead
			providers: [
				{ provide: NavParams, useClass: NavParamsMock },
				{ provide: TodoService, useValue: todoServiceStub }
			]
		})
			// compile template and css
			// NOTE: DO NOT config TestBed after method below
			.compileComponents();
	}));

	// synchronous beforeEach (waits for async beforeEach above to complete)
	beforeEach(() => {
		fixture = TestBed.createComponent(SideMenu);
		comp = fixture.componentInstance;
		// get todoService actually injected
		// this one is the 'service' actually used in testing
		tServ = fixture.debugElement.injector.get(TodoService);
		// also can: get todoService from the root injector
		// todoService = TestBed.get(TodoService);

		spyOn(tServ, 'slothGetCurrentBoard').and.returnValue(tServ.currentBoard);
		spyOn<SideMenu>(comp, 'slothCurrentBoard').and.returnValue(tServ.slothGetCurrentBoard());

		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(comp instanceof SideMenu).toBe(true);
	});

});