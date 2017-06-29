import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

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
	public static Todo2: Todo = new Todo('Rewrite Jasmine to support async better', Mocks.Category2, Mocks.MockDate, false, undefined, false, Priority.Low, 1);
	public static TodoArray: Todo[] = [Mocks.Todo, Mocks.Todo2];
	public static CategoryArray: Category[] = [Mocks.Category, Mocks.Category2];
	public static Board: Board = new Board('Test Board', Mocks.TodoArray, Mocks.CategoryArray, Mocks.MockDate, 0);	
	
	public static User: User = new User(0, 'Testy', 'Testpaca', 'TestPaca', 'texting.alpaca@gmail.com', undefined);
}

// IONIC SAMPLE 

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
