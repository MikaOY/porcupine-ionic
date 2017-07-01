import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { AppModule } from "../../../app/app.module";
import { TodosModule } from '../todos.module';
import { SideMenuModule } from '../../side-menu/side-menu.module';
import { NavParams } from 'ionic-angular';
import { Mocks, NavParamsMock } from '../../../../test-config/mocks-ionic';
import { click } from '../../../../test-config/index';

import { TodoList } from './todo-list.component';
import { TodoService } from '../../../app/services/todo.service';
import { Board } from '../../../app/classes/board';

let comp: TodoList;
let fixture: ComponentFixture<TodoList>;
let de: DebugElement;
let aTodoBt: DebugElement;
let ele: HTMLElement
let buttonArray: DebugElement[]
let tServ;

// stub must have props and methods used in testing, but is NOT used
let todoServiceStub = {
	currentBoard: Mocks.Board,
	slothGetCurrentBoard() {
		return Promise.resolve(Mocks.Board);
	},

	nextBoard(board: Board) {
		var boardIndex: number;
		var returnBoard: Board;
		boardIndex = Mocks.BoardsArray.indexOf(board);
		if (boardIndex + 1 == Mocks.BoardsArray.length) {
			returnBoard = Mocks.BoardsArray[0];
		}
		else {
			returnBoard = Mocks.BoardsArray[boardIndex + 1];
		}
		return returnBoard;
	}
};

describe('Todo List', () => {
	
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
		fixture = TestBed.createComponent(TodoList);
		comp = fixture.componentInstance;
		// get todoService actually injected
		// this one is the 'service' actually used in testing
		tServ = fixture.debugElement.injector.get(TodoService);
		// also can: get todoService from the root injector
		// todoService = TestBed.get(TodoService);

		spyOn(tServ, 'slothGetCurrentBoard').and.returnValue(tServ.currentBoard);
		spyOn<TodoList>(comp, 'slothCurrentBoard').and.returnValue(tServ.slothGetCurrentBoard());

		buttonArray = fixture.debugElement.queryAll(By.css('button'));
		aTodoBt = buttonArray[11];

		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(comp instanceof TodoList).toBe(true);
	});

	it('should open the add todo menu on click add todo btn', () => {
		fixture.detectChanges();
		expect(comp.isAddTodoActive).toBeFalsy;
		aTodoBt = fixture.debugElement.query(By.css('#addTodoButton'));
		expect(aTodoBt).toBeDefined;
		aTodoBt.triggerEventHandler('click', null);
		expect(comp.isAddTodoActive).toBeTruthy;
	});

	xit('should change the todolist color when activating select', () => {
		comp.activateSelect(Mocks.Todo);

	});
});