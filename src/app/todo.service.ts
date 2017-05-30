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
import 'rxjs/add/observable/fromPromise';

const CATS0: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 0, true, 0),
new Category('Coding', 2, new Date(2017, 3, 26), 1, true, 2),
new Category('Unsorted', 0, null, 2, true, 0)];

const TODOS0: Todo[] = [new Todo('Give an alpaca a hug', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13)),
new Todo('Finish Porcupine', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium),
new Todo('Make moist brownie', CATS0[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High),
new Todo('Upload photos to Drive', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
new Todo('Pet a pug', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium)];

const BOARDS: Board[] = [new Board('Important Things in Life', TODOS0.reverse(), CATS0.reverse(), undefined, undefined),
new Board('More Things Todo', TODOS0, CATS0, undefined, undefined)]

const ColorArray: string[] = ["#919191", "#ff5c3f", "#ffb523", "#6f9b53", "#1371d6", "#423e7c", "#7606cc", "#c613b4"];

@Injectable()
export class TodoService {
	public CurrentBoard: Board; //TODO: change to behaviorSubject
	public CachedBoards: Board[] = [];
	public CachedTodos: Todo[] = [];
	public CachedCats: Category[] = [];

	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

	constructor(private http: Http) {
		// TODO: change to splashscreen - filled with temp sample data to look nice while loading
		this.CurrentBoard = BOARDS[0];
	}

	/* START public HTTP functions */

	public getBoards(): Promise<Board[]> {
		console.log("requesting boards...");

		let id: number = 1;
		const url = `${this.apiUrl}/board?personId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log("processing boards...");
			let array: Board[] = [];
			for (let json of response.json()) {
				array.push(new Board(json['title'], TODOS0, CATS0, json['date_created'], json['board_id']));
			}

			console.log("setting public properties boards...");
			this.CachedBoards = array;
			this.CurrentBoard = this.CachedBoards[0];
			console.log('Boards retrieved!');
			return array;
		})
			.catch(this.handleError);
	}

	public getCategories(): Promise<Category[]> {
		console.log("requesting categories...");

		let id: number = 1;
		const url = `${this.apiUrl}/category?personId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log("processing categories...");
			let array: Category[] = [];
			for (let json of response.json()) {
				array.push(new Category(json['title'],
					json['color'],
					new Date(json['date_created']),
					json['category_id'],
					true,
					json['default_order'],
					json['default_priority']));
				
				console.log("filling Cat[] in CurrentBoard..." + array.length);
				// Populate Categories: Category[] prop in boards
				let isAssigned, hasReset: boolean = false;
				while (isAssigned == false) {
					if (this.CachedBoards !== null 
						&& this.CachedBoards !== undefined 
						&& this.CachedBoards.length >= 0) {
						console.log("CATS: CachedBoard = " + this.CachedBoards + " OK"); 
						// find board in cached where id matches cat board_id prop, 
						this.CachedBoards.find((board, index, array) => json['board_id'] == board.DbId)
						// add cat to Cat[] prop on board
							.Categories.push(array[array.length - 1]);

						// remove sample data ONCE
						if (!hasReset) {
							hasReset = true;
							// loop through cached boards
							this.CachedBoards.forEach(board => {
								// loop through todos of each board
								board.Categories.forEach(cat => {
									// if todo is in sample array,
									if ((CATS0.find((sample, index, array) => cat.DbId == sample.DbId) != undefined)) {
										// delete the todo
										console.log('Deleting sample category: ' + cat.Name);
										let index = board.Categories.indexOf(cat);
										board.Categories.splice(index, 1);
									}
								});
							});
						}
						
						isAssigned = true;
					} else {
						console.log('CATS: CachedBoards unavailable, trying again...');
					}
				}
			}

			console.log("setting public properties cats...");
			this.CachedCats = array;
			console.log('Categories retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public getTodos(): Promise<Todo[]> {
		console.log("requesting todos...");

		let id: number = 1;
		const url = `${this.apiUrl}/todo?personId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log("processing todos...");

			let array: Todo[] = [];
			for (let json of response.json()) {
				array.push(new Todo(json['todo_info'],
					this.CachedCats.find((cat, index, array) => cat.DbId == json['category_id']), // find category with id
					new Date(json['date_created']),
					json['is_done'],
					new Date(json['date_done']),
					json['is_archived'],
					Priority[Priority[json['priority_value']]],
					null, // due date not implemented in DB yet
					json['todo_id']));
				
				console.log("filling Todo[] in CurrentBoard..." + array.length);
				// Populate Todos: Todo[] prop in boards
				let isAssigned, hasReset: boolean = false;
				while (!isAssigned) {
					if (this.CachedBoards !== null 
						&& this.CachedBoards !== undefined 
						&& this.CachedBoards.length >= 0) {
						console.log("TODO: CachedBoard = " + this.CachedBoards + " OK");

						// find board in cached where Cat[] contains current todo cat, 
						this.CachedBoards.find((board, index, array) => {
							let cat = this.CachedCats.find((cat, index, array) => cat.DbId == json['category_id']);
							return board.Categories.find((bCat, index, array) => bCat == cat) !== undefined;
						})
						// add current todo to that board's Todo[]
						.Todos.push(array[array.length - 1]);

						// remove sample data ONCE
						if (!hasReset) {
							hasReset = true;
							// loop through cached boards
							this.CachedBoards.forEach(board => {
								// loop through todos of each board
								board.Todos.forEach(todo => {
									// if todo is in sample array,
									if ((TODOS0.find((sample, index, array) => todo == sample) != undefined)) {
										// delete the todo
										console.log('Deleting sample todo: ' + todo.Info);
										let index = board.Todos.indexOf(todo);
										board.Todos.splice(index, 1);
									}
								});
							});
						}

						isAssigned = true;
					} else {
						console.log('TODOS: CachedBoards unavailable, trying again...');
					}
				}
			}

			console.log("setting public properties todos...");
			this.CachedTodos = array;
			this.CurrentBoard.Todos = array;
			console.log('Todos retrieved!');
			return array;
		}).catch(this.handleError);
	}

	/* END public HTTP functions */

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

	getCurrentBoard(): Observable<Board> {
		console.log("GETting boards...");
		return Observable.fromPromise(this.getBoards().then((array) => { return array[0]; }).catch(this.handleError));	
	}

	changeBoard(): Promise<Board> {
		let boardIndex = this.CachedBoards.indexOf(this.CurrentBoard);

		if (boardIndex + 1 == this.CachedBoards.length) {
			this.CurrentBoard = this.CachedBoards[0];
		}
		else {
			this.CurrentBoard = this.CachedBoards[boardIndex + 1];
		}

		return Promise.resolve(this.CurrentBoard);
	}

	getColors(): Promise<string[]> {
		return Promise.resolve(ColorArray);
	}
}