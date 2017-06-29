import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoService } from './todo.service';

import { UserService } from './user.service';
import { PlatformMock, StatusBarMock, SplashScreenMock, Mocks } from '../../../test-config/mocks-ionic';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { User } from '../classes/user';


// describe('TodoList Component', () => {
//   let fixture: ComponentFixture<TodoList>;
//   let component: TodoList;
// 	let de: DebugElement;

//   beforeEach(async(() => {
// 		var todoServiceStub = {
			
// 		}
//     TestBed.configureTestingModule({
//       declarations: [TodoList],
// 			schemas: [ NO_ERRORS_SCHEMA ],
//       imports: [
//         IonicModule.forRoot(TodoList)
//       ],
//       providers: [
// 				{ provide: TodoService, useClass: todoServiceStub},
//         { provide: StatusBar, useClass: StatusBarMock },
//         { provide: SplashScreen, useClass: SplashScreenMock },
//         { provide: Platform, useClass: PlatformMock }
//       ]
//     });
//   }));

// 	beforeEach(() => {
		
//     fixture = TestBed.createComponent(TodoList);
//     component = fixture.componentInstance;

// 		var todoService = TestBed.get(TodoService);
//   });

// 	describe('#activateSelect()', () => {
// 		it('should make selectActive true', () => {
// 			component.activateSelect(this.testTodo);
// 			expect(component.isSelectActive).toBe(true);
// 		});
// 	});
// });

describe('TodoService', () => {
	let uServ: UserService;
	let tServ: TodoService;

	beforeEach(() => {
		uServ = new UserService(undefined, undefined, undefined);
		spyOn(uServ, 'getUser').and.returnValue(Mocks.userMock);

		tServ = new TodoService(undefined, uServ);
	});

	describe('Fake login', () => {
		it('should call getUser from UserService', () => {
			expect(uServ.getUser).toHaveBeenCalled();
		});
	});
});