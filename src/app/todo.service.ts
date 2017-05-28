import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './category';
import { Priority } from './priority';
import { Board } from './board';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/toPromise';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const CATS0: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 0, true),
new Category('Code', 2, new Date(2017, 3, 26), 1, true),
new Category('Unsorted', 0, null, 2, true)];
const CATS1: Category[] = [new Category('Pinapples', 1, new Date(2017, 4, 30), 0, true),
new Category('Leaf', 2, new Date(2017, 3, 26), 1, true),
new Category('Unsorted', 0, null, 2, true)];

// TODO: replace with DB info
const TODOS0: Todo[] = [new Todo('Give an alpaca a hug', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13)),
new Todo('Finish Porcupine', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium),
new Todo('Make moist brownie', CATS0[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High),
new Todo('Upload photos to google drive', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
new Todo('Pet a pug', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium)];
const TODOS1: Todo[] = [new Todo('Tell an alpaca he is loved', CATS1[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13)),
new Todo('Get some grapes from the store', CATS1[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium),
new Todo('Draw lovehearts', CATS1[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High),
new Todo('Wash dishes', CATS1[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
new Todo('Code some frontend!!', CATS1[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium)];

const ColorArray: string[] = ["#919191", "#ff5c3f", "#ffb523", "#6f9b53", "#1371d6", "#423e7c", "#7606cc", "#c613b4"];

@Injectable()
export class TodoService {
  BOARDS: Board[] = [];

  public CurrentBoard: Board;
  public CachedBoards: Board[];
  public CachedTodos: Todo[];
  public CachedCats: Category[];

  private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

  constructor(private http: Http) { }

  getBoards(): Observable<Board[]> {
    console.log("requesting boards...");

    let id: number = 0;
    const url = `${this.apiUrl}/board?personId=${id}`;
    return this.http.get(url).map(this.extractBoardData).catch(this.handleError);
  }

  getCurrentBoard(): Promise<Board> {
    return this.getBoards().toPromise().then(array => array[0]).catch(this.handleError);
  }

  changeBoard(): Promise<Board> {
    let boardIndex = this.BOARDS.indexOf(this.CurrentBoard);

    if (boardIndex + 1 == this.BOARDS.length) {
      this.CurrentBoard = this.BOARDS[0];
    }
    else {
      this.CurrentBoard = this.BOARDS[boardIndex + 1];
    }

    return Promise.resolve(this.CurrentBoard);
  }

  getColors(): Promise<string[]> {
    return Promise.resolve(ColorArray);
  }

  public getTodos(): Observable<Todo[]> {
    const url = `${this.apiUrl}/todo/0`;
    console.log("requesting todos...");
    return this.http.get(url).map(this.extractTodoData).catch(this.handleError);
  }

  private extractBoardData(response: any) {
    let array: Board[] = [];
    for (let json of response.json()) {
      array.push(new Board(json['title'], TODOS0, CATS0, json['date_created'], json['board_id']));
    }

    this.CachedBoards = array;
    this.CurrentBoard = array[0];
    return array;
  }

  private extractTodoData(response: any) {
    console.log("extracting todos...");

    let array: Todo[] = [];
    for (let json of response.json()) {
      let todo = new Todo(json['todo_info'],
        new Category('Testing', null, null, 5),
        new Date(json['date_created']),
        json['is_done'],
        new Date(json['date_done']),
        json['is_archived'],
        Priority.Medium,
        null,
        json['todo_id']);
      array.push(todo);
    }

    this.CachedTodos = array;
    this.CurrentBoard.Todos = array;
    return array;
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    console.error('Something went wrong!');
    return Observable.throw(errMsg);
  }
}