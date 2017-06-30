import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { User } from '../src/app/classes/user';
import { Board } from '../src/app/classes/board';
import { Category } from '../src/app/classes/category';
import { Todo } from '../src/app/classes/todo';
import { Priority } from '../src/app/classes/priority';

// Mock data used in specs
export class Mocks {
	public static MockDate: Date = new Date('2017-06-29 3:33:00');

	public static Category: Category = new Category('Unit testing', 0, Mocks.MockDate, 0, 0, Priority.Medium);
	public static Category2: Category = new Category('Dreams', 1, Mocks.MockDate, 1, 0, Priority.High);
	public static Todo: Todo = new Todo('Write unit tests', Mocks.Category, Mocks.MockDate, false, undefined, false, Priority.Low, 0);
	public static Todo2: Todo = new Todo('Rewrite Jasmine to support async better', Mocks.Category2, Mocks.MockDate, true, new Date(2016, 1, 13), false, Priority.Low, 1);
	public static TodoArray: Todo[] = [Mocks.Todo, Mocks.Todo2];
	public static CategoryArray: Category[] = [Mocks.Category, Mocks.Category2];
	public static Board: Board = new Board('Test Board', Mocks.TodoArray, Mocks.CategoryArray, Mocks.MockDate, 0);	
	
	public static Category3: Category = new Category('Nom noms', 0, Mocks.MockDate, 3, 1);
	public static Category4: Category = new Category('For The Pigs', 2, Mocks.MockDate, 1, 4);
	public static Todo3: Todo = new Todo('Eat pineapples', Mocks.Category3, Mocks.MockDate, false, undefined, false, Priority.Medium, 3);
	public static Todo4: Todo = new Todo('Brush piglets', Mocks.Category4, Mocks.MockDate, false, undefined, false, Priority.High, 3);
	public static TodoArray2: Todo[] = [Mocks.Todo3, Mocks.Todo4];
	public static CategoryArray2: Category[] = [Mocks.Category3, Mocks.Category4];
	public static Board2: Board = new Board('Testacular', Mocks.TodoArray2, Mocks.CategoryArray2, Mocks.MockDate, 2)
	public static BoardsArray: Board[] = [Mocks.Board, Mocks.Board2];

	// TODO: password 
	public static User: User = new User(0, 'Curly', 'Alpaca', 'Curlpaca', 'curly@alpaca.com', undefined);
	public static UserJSON: any = { 'person_id': 0, 'fname': 'Curly', 'lname': 'Alpaca', 'username': 'Curlpaca', 'person_email': 'curly@alpaca.com' };
}

export function AuthHttpServiceFactoryMock(http: Http, options: RequestOptions) {
	return new AuthHttp(new AuthConfig(), http, options);
}

export class NavParamsMock {
  data = {
  };

  get(param){
    return this.data[param];
  }
}

export class PlatformMock {
  public ready(): Promise<{String}> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}
