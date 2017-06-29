import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoService } from './todo.service';

import { UserService } from './user.service';
import { PlatformMock, StatusBarMock, SplashScreenMock } 
	from '../../../test-config/mocks-ionic';
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
	let service: TodoService;
	// let userService = {
	// 	getUser() {
	// 		let user: User = new User(0, 'bob', 'joe', 'ilovealpacas', 'piglet@gmail.com');
	// 		return Promise.resolve(user);
	// 	}
	let userService: UserService = new UserService(undefined, undefined, undefined);
};
	beforeEach(() => {
		service = new TodoService(undefined, userService);
	});

	it('should return a board on slothBoard', () => {
		expect(service.slothGetCurrentBoard()).toBeDefined;
	});
});