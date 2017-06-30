import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';

import { IonicModule, Platform } from 'ionic-angular';
import { AppModule } from "../../app/app.module";
import { TodosModule } from './todos.module';
import { SideMenuModule } from '../side-menu/side-menu.module';
import { NavParams } from 'ionic-angular';
import { Mocks, NavParamsMock } from '../../../test-config/mocks-ionic';

import { TodoService } from '../../app/services/todo.service';
import { TodosPage } from './todos';
import { Board } from '../../app/classes/board';

describe('Todos page', () => {
	let comp: TodosPage;
	let fixture: ComponentFixture<TodosPage>;
	let de: DebugElement;
  let el: HTMLElement;
	let tServ;
	// stub must have props and methods used in testing, but is NOT used
	let todoServiceStub = {
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
		fixture = TestBed.createComponent(TodosPage);
		comp = fixture.componentInstance;

		// get todoService actually injected
		// this one is the 'service' actually used in testing
		tServ = fixture.debugElement.injector.get(TodoService);
		// also can: get todoService from the root injector
		// todoService = TestBed.get(TodoService);

		spyOn(tServ, 'slothGetCurrentBoard');
		spyOn<TodosPage>(comp, 'slothCurrentBoard');
	});

	it('should be created', () => {
		expect(comp instanceof TodosPage).toBe(true);
	});

	it('should call slothCurrentBoard()', () => {
		comp.slothCurrentBoard();
		expect(comp.slothCurrentBoard).toHaveBeenCalled();
	});

	it('should call slothGetCurrentBoard() from TodoService', () => {
		fixture.detectChanges();
		expect(tServ.slothGetCurrentBoard).toHaveBeenCalled();
	});

	it('should change to the next board', () => {
		comp.changeBoard(Mocks.Board);
		var currentBoard = comp.slothCurrentBoard();
		expect(currentBoard).toBeDefined;
	});
});