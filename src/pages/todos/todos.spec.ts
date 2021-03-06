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
  let cBoardName: HTMLElement;
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

		spyOn(tServ, 'slothGetCurrentBoard').and.returnValue(tServ.currentBoard);
		spyOn<TodosPage>(comp, 'slothCurrentBoard').and.returnValue(tServ.slothGetCurrentBoard());

		// getting the label by id 
		de = fixture.debugElement.query(By.css('#currentBoardName'));
		cBoardName = de.nativeElement;
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

	it('should change to the next board and update name', () => {
		comp.changeBoard(Mocks.Board);
		var currentBoard = comp.slothCurrentBoard();
		fixture.detectChanges();
		expect(currentBoard).toBeDefined;
		expect(cBoardName.textContent).toEqual(currentBoard.Name);
	});

	it('should display current board name', () => {
		fixture.detectChanges();
		expect(cBoardName.textContent).toContain(Mocks.Board.Name);
	});

	it('should archive todos with datedone of more than 24 hours ago', () => {
		expect(Mocks.Todo2.IsArchived).toEqual(false);
		comp.archiveTodos();
		fixture.detectChanges();
		expect(Mocks.Todo2.IsArchived).toEqual(true);
	});
});