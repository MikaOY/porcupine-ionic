
//  import { Category } from '../../../app/classes/category';
//  import { Todo } from '../../../app/classes/todo';
//  import { Priority } from '../../../app/classes/priority';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform } from 'ionic-angular';
import { TodoList } from './todo-list.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoService } from '../../../app/services/todo.service';

import { PlatformMock, StatusBarMock, SplashScreenMock } 
	from '../../../../test-config/mocks-ionic';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('TodoList Component', () => {
  let fixture: ComponentFixture<TodoList>;
  let component: TodoList;
	let de: DebugElement;

  beforeEach(async(() => {
		var todoServiceStub = {
			
		}
    TestBed.configureTestingModule({
      declarations: [TodoList],
			schemas: [ NO_ERRORS_SCHEMA ],
      imports: [
        IonicModule.forRoot(TodoList)
      ],
      providers: [
				{ provide: TodoService, useClass: todoServiceStub},
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    });
  }));

	beforeEach(() => {
		
    fixture = TestBed.createComponent(TodoList);
    component = fixture.componentInstance;

		var todoService = TestBed.get(TodoService);
  });

	// describe('#activateSelect()', () => {
	// 	it('should make selectActive true', () => {
	// 		component.activateSelect(this.testTodo);
	// 		expect(component.isSelectActive).toBe(true);
	// 	});
	// });
});

  
	
// 	beforeEach(() => {
// 		t = new TodoList.TodoList(undefined, undefined);
// 		var testCat: Category = new Category('Tasks', 0, new Date(), 13, 1);
// 		var testTodo = new Todo('Take out trash', testCat, new Date(), 
// 			false, undefined, false, Priority.Low, 2);
// 	});
	
// });



