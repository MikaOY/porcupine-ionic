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


// Samples DbId set to 123456789 for easy removal 
const CATS0: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 123456789, 0, true, 0),
new Category('Coding', 2, new Date(2017, 3, 26), 123456789, 0, true, 2),
new Category('Unsorted', 0, null, 123456789, 0, true, 0)];

const TODOS0: Todo[] = [new Todo('Give an alpaca a hug', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13), 123456789),
new Todo('Finish Porcupine', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium, null, 123456789),
new Todo('Make moist brownie', CATS0[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High, null, 123456789),
new Todo('Upload photos to Drive', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 22), 123456789),
new Todo('Pet a pug', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium, new Date(2016, 5, 30), 123456789)];

const BOARDS: Board[] = [new Board('Important Things in Life', TODOS0.reverse(), CATS0.reverse(), undefined, undefined),
new Board('More Things Todo', TODOS0, CATS0, undefined, undefined)];

const ColorArray: string[] = ['#919191', '#ff5c3f', '#ffb523', '#6f9b53', '#1371d6', '#423e7c', '#7606cc', '#c613b4'];

@Injectable()
export class TodoService {
	public CurrentBoard: Board; //TODO: change to behaviorSubject
	public CachedBoards: Board[] = [];
	public CachedTodos: Todo[] = [];
	public CachedCats: Category[] = [];

	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

	constructor(private http: Http) { }

	/* START public HTTP functions */

	public addBoard(newBoard: Board): Promise<void> {
		console.log('adding board...');

		let id: number = 0;
		const url = `${this.apiUrl}/board?userId=${id}`;

		return this.http.post(url,
			`{"userId": ${id},
			"title": ${newBoard.Name},
			"dateCreated": ${newBoard.DateCreated}
			}`).toPromise().then((response: any) => {
				console.log("addBoard response:" + response.toString);
			}).catch(this.handleError);
	}

	public getBoards(): Promise<Board[]> {
		console.log('requesting boards...');

		let id: number = 0;
		const url = `${this.apiUrl}/board?userId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('processing boards...');
			let array: Board[] = [];
			for (let json of response.json()) {
				array.push(new Board(json['title'], TODOS0, CATS0, json['date_created'], json['board_id']));
			}

			console.log('setting public properties boards...');
			this.CachedBoards = array;
			this.CurrentBoard = this.CachedBoards[0];
			console.log('Boards retrieved!');
			return array;
		})
			.catch(this.handleError);
	}

	public updateBoard(board: Board): Promise<void> {
		console.log('updating board...');

		let id: number = 0;
		const url = `${this.apiUrl}/board?userId=${id}`;

		return this.http.put(url,
			`{ "userId": ${id},
				"boardId": ${board.DbId},
				"title" : ${board.Name},
				"dateCreated" : ${board.DateCreated}
			 	}`).toPromise().then((response: any) => {
				console.log("updateBoards response:" + response.toString);
			}).catch(this.handleError);
	}

	public addCategory(newCat: Category): Promise<void> {
		console.log('adding category...');

		let id: number = 0;
		const url = `${this.apiUrl}/category?userId=${id}`;

		return this.http.post(url,
			`{"userId": ${id},
			"title": ${newCat.Name},
			"color: ${newCat.Color},
			"defaultOrder": ${newCat.Order},
			"priorityVal": ${newCat.DefaultPriority},
			"dateCreated": ${newCat.DateCreated},
			"boardId": ${newCat.BoardId}
			}`).toPromise().then((response: any) => {
				console.log("addCategory response:" + response.toString);
			}).catch(this.handleError);
	}

	public getCategories(): Promise<Category[]> {
		console.log('requesting categories...');

		let id: number = 0;
		const url = `${this.apiUrl}/category?userId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('processing categories...');

			let array: Category[] = [];
			let i: number = 0;
			for (let json of response.json()) {
				i++;
				array.push(new Category(json['title'],
					json['color'],
					new Date(json['date_created']),
					json['category_id'],
					json['board_id'],
					true,
					json['default_order'],
					json['default_priority']));

				console.log("getCats: " + array[array.length - 1].Name + ' ' + array[array.length - 1].DbId + ' ' + array[array.length - 1].BoardId);

				// Populate Categories: Category[] prop in boards
				let isAssigned: boolean = false;
				while (isAssigned == false) {
					while (this.CachedBoards == null
						|| this.CachedBoards == undefined
						|| this.CachedBoards.length == 0) {
						//console.log('CATS: CachedBoards unavailable, ' + this.CachedBoards);
					}

					console.log('CATS: CachedBoard = ' + this.CachedBoards + ' OK');
					// find board in cached where id matches cat board_id prop, 
					let b: Board = this.CachedBoards.find((board, index, array) => json['board_id'] == board.DbId);
					// add cat to Cat[] prop on board
					b.Categories.push(array[array.length - 1]);
					isAssigned = true;

					console.log('Assigning ' + array[array.length - 1].Name + ' to ' + b.Name);

					// remove sample data ONCE when at last index
					if (i == (response.json().length - 1)) {
						while (this.CachedBoards == null) {
							console.log('Cat: Waiting for CachedBoards...');
						}

						// loop through cached boards
						this.CachedBoards.forEach(board => {
							// loop through cats of each board
							board.Categories.forEach(cat => {
								// if cat is in sample array,
								if (cat.DbId == 123456789) {
									// delete the cat
									console.log('Deleting sample category: ' + cat.Name);
									let index = board.Categories.indexOf(cat);
									board.Categories.splice(index, 1);
								}
							});
						});
					}

				}
			}

			console.log('setting public properties cats...');
			this.CachedCats = array;
			console.log('Categories retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public updateCategory(cat: Category): Promise<void> {
		console.log('updating category...');

		let id: number = 0;
		const url = `${this.apiUrl}/category?userId=${id}`;

		return this.http.put(url,
			`{ "userId": ${id},
				"cateogryId": ${cat.DbId},
				"catTitle" : ${cat.Name},
				"catBoardId" : ${cat.BoardId},
				"color" : ${cat.Color},
				"catDateCreated" : ${cat.DateCreated},
				"defaultOrder" : ${cat.Order},
				"priorityValue": ${cat.DefaultPriority}
			 	}`).toPromise().then((response: any) => {
				console.log("updateCategories response:" + response.toString);
			}).catch(this.handleError);
	}

	public addTodo(newTodo: Todo): Promise<void> {
		console.log('adding todo...');

		let id: number = 0;
		const url = `${this.apiUrl}/todo?userId=${id}`;

		return this.http.post(url,
			`{"userId": ${id},
			"info": ${newTodo.Info},
			"categoryId: ${newTodo.Category.DbId},
			"dateCreated": ${newTodo.DateCreated},
			"isDone": ${newTodo.IsDone},
			"dateDone": ${newTodo.DateDone},
			"isArchived": ${newTodo.IsArchived},
			"priorityVal": ${newTodo.Priority}
			}`).toPromise().then((response: any) => {
				console.log("addTodo response:" + response.toString);
			}).catch(this.handleError);
	}

	public getTodos(): Promise<Todo[]> {
		console.log('requesting todos...');

		let id: number = 0;
		const url = `${this.apiUrl}/todo?userId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('processing todos...');

			let array: Todo[] = [];
			let i: number = 0;
			for (let json of response.json()) {
				i++;
				array.push(new Todo(json['todo_info'],
					this.CachedCats.find((cat, index, array) => cat.DbId == json['category_id']), // find category with id
					new Date(json['date_created']),
					json['is_done'],
					new Date(json['date_done']),
					json['is_archived'],
					Priority[Priority[json['priority_value']]],
					null, // due date not implemented in DB yet
					json['todo_id']));

				console.log('filling Todo[] in CurrentBoard...' + array.length);
				// Populate Todos: Todo[] prop in boards
				let isAssigned: boolean = false;
				while (!isAssigned) {
					console.log('Assigning TODO to board: ' + array[array.length - 1].Info);
					if (this.CachedBoards != undefined
						&& this.CachedBoards != null
						&& this.CachedCats != undefined
						&& this.CachedCats != null
						&& this.CachedBoards.length >= 0
						&& this.CachedCats.length >= 0) {
						isAssigned = true;
						console.log('TODO: CachedBoard and CachedCats OK');
						console.log('cachedCats length:' + this.CachedCats.length);

						// assign todo to a board
						// 1 - find todo category
						while (this.CachedCats == undefined) {
							// Wait for CachedCats to be defined
						}
						let todoCat: Category = this.CachedCats.find((cat, index, array) => {
							console.log('cat name = ' + cat.Name + ' CatId = ' + cat.DbId); //cannot read Name of undefined sometimes
							console.log('TODO cat id = ' + json['category_id']);
							return cat.DbId == json['category_id'];
						});
						console.log('todoCat = ' + todoCat.Name);

						// 2 - find board whose DbId matches cat's BoardId prop
						while (this.CachedBoards == undefined) {
							// Wait for CachedBoards to be defined
						}
						let b: Board = this.CachedBoards.find((board, index, array) => {
							// (do not search until Cats[] prop on board is not empty/ null)
							while (board.Categories == null || board.Categories.length == 0) {
								console.log('TODOS: Cat[] prop on ' + board.Name + ' unavailable! Waiting...');
							}
							board.Categories.forEach((cat, index, catArray) => console.log(cat.Name + ' ' + cat.DbId));

							// (board Cats[] not null, can continue with check)
							return board.DbId == todoCat.BoardId;
						});

						// 3 - add current todo to that board's Todo[]
						b.Todos.push(array[array.length - 1]);
						isAssigned = true;

						console.log('Assigning ' + array[array.length - 1].Info + ' to ' + b.Name);

						// remove sample data ONCE when at last index
						if (i == (response.json().length - 1)) {
							while (this.CachedBoards == null) {
								console.log('Todo: Waiting for CachedBoards...');
							}

							// loop through cached boards
							this.CachedBoards.forEach(board => {
								// loop through todos of each board
								board.Todos.forEach(todo => {
									// if todo is in sample array,
									if (todo.DbId == 123456789) {
										// delete the todo
										console.log('Deleting sample todo: ' + todo.Info);
										let index = board.Todos.indexOf(todo);
										board.Todos.splice(index, 1);
									}
								});
							});
						}
					} else {
						console.log('TODOS: CachedBoards unavailable, trying again...');
					}
				}
			}

			console.log('setting public properties todos...');
			this.CachedTodos = array;
			this.CurrentBoard.Todos = array;
			console.log('Todos retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public updateTodo(todo: Todo): Promise<void> {
		console.log('updating todo...');

		let id: number = 0;
		const url = `${this.apiUrl}/todo?userId=${id}`;
		return this.http.put(url,
			`{ "userId": ${id},
				"todoId": ${todo.DbId},
				"info" : ${todo.Info},
				"categoryId" : ${todo.Category.DbId},
				"priorityVal" : ${todo.Priority},
				"isDone" : ${todo.IsDone ? 1 : 0},
				"dateDone" : ${todo.DateDone},
				"isArchived: ${todo.IsArchived ? 1 : 0}
			 	}`).toPromise().then((response: any) => {
				console.log("updateTodos response:" + response.toString);
			}).catch(this.handleError);
	}

	public deleteTodo(todo: Todo) : Promise<void> {
		console.log('deleting todo...');

		let id: number = 0;
		const url = `${this.apiUrl}/todo?userId=${id}`; // CHANGE 
		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('TODO delete: ' + response.toString());
		})
		.catch(this.handleError);
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
		console.log('GETting boards...');
		return Observable.fromPromise(this.getBoards().then((array) => { return array[0]; }).catch(this.handleError));
	}

	changeBoard(board: Board): Promise<Board> {
		let boardIndex = this.CachedBoards.indexOf(board);

		if (boardIndex + 1 == this.CachedBoards.length) {
			this.CurrentBoard = this.CachedBoards[0];
		}
		else {
			this.CurrentBoard = this.CachedBoards[boardIndex + 1];
		}

		return Promise.resolve(this.CurrentBoard);
	}

	openBoard(board: Board): Promise<Board> {
		this.CurrentBoard = board;
		return Promise.resolve(this.CurrentBoard);
	}

	getColors(): Promise<string[]> {
		return Promise.resolve(ColorArray);
	}
}