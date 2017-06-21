import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './category';
import { Priority } from './priority';
import { Board } from './board';

import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';


// Samples DbId set to 123456789 for easy removal 
const CATS0: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 123456789, 0, 0, true, false),
new Category('Coding', 2, new Date(2017, 3, 26), 123456789, 0, 2, true, false),
new Category('Unsorted', 0, null, 123456789, 0, 0, true, false)];

const TODOS0: Todo[] = [new Todo('Give an alpaca a hug', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, 123456789),
new Todo('Finish Porcupine', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium, 123456789),
new Todo('Make moist brownie', CATS0[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High, 123456789),
new Todo('Upload photos to Drive', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, 123456789),
new Todo('Pet a pug', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium, 123456789)];

// const BOARDS: Board[] = [new Board('Important Things in Life', TODOS0.reverse(), CATS0.reverse(), undefined, undefined),
// new Board('More Things Todo', TODOS0, CATS0, undefined, undefined)];

const ColorArray: string[] = ['#919191', '#ff5c3f', '#ffb523', '#6f9b53', '#1371d6', '#423e7c', '#7606cc', '#c613b4'];

@Injectable()
export class TodoService {
	public CurrentBoard: Board;
	public CachedBoards: Board[] = [];
	public CachedTodos: Todo[] = [];
	public CachedCats: Category[] = [];

	private isBusy: boolean = false;

	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	private id: number = 0;

	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http) {
		this.CachedBoards = [];
		this.CachedCats = [];
		this.CachedTodos = [];
	}

	/* START public HTTP functions */

	public addBoard(newBoard: Board): Promise<void> {
		console.log('adding board...');

		const url = `${this.apiUrl}/board`;

		var details = {
			'userId': String(this.id),
			'title': newBoard.Name,
			'dateCreated': '',
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + '\'' + encodedValue + '\'');
		}
		let body = formBody.join("&");

		return this.http.post(url, body, this.options).toPromise().then((response: any) => {
			console.log("addBoard response:" + response.toString);
		}).catch(this.handleError);
	}

	private GETBoards(): Observable<Board[]> {
		console.log('requesting boards...');

		const url = `${this.apiUrl}/board?userId=${this.id}`;

		return this.http.get(url).map((response: any) => {

			console.log('processing boards...');

			let array: Board[] = [];
			for (let json of response.json()) {
				array.push(new Board(json['title'], TODOS0, CATS0, json['date_created'], json['board_id']));
			}

			// assign built array to cache
			// if already has boards in cache, delete them
			array.forEach(arrayB => {
				if (this.checkIfAvailable([this.CachedBoards])) {
					let possibleDuplicate: Board = this.CachedBoards.find((cacheB, cacheIndex, cacheArray) => cacheB.DbId == arrayB.DbId);
					if (possibleDuplicate != undefined) {
						this.CachedBoards.splice(this.CachedBoards.indexOf(possibleDuplicate));
					}
				}
			});
			this.CachedBoards = array;
			this.CurrentBoard = this.CachedBoards[0];
			return array;
		}).share()
			.catch(this.handleError);
	}

	public updateBoard(board: Board): Promise<void> {
		console.log('updating board...');

		const url = `${this.apiUrl}/board`;

		var details = {
			'userId': String(this.id),
			'title': board.Name,
			'boardId': board.DbId,
			'dateCreated': board.DateCreated.toISOString()
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + '\'' + encodedValue + '\'');
		}
		let body = formBody.join("&");

		return this.http.put(url, body, this.options).toPromise().then((response: any) => {
			console.log("updateBoards response:" + response.toString);
		}).catch(this.handleError);
	}

	public deleteBoard(board: Board): Promise<void> {
		console.log('deleting board...');

		const url = `${this.apiUrl}/board?boardId=${board.DbId}`;
		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('BOARD delete: ' + response.toString());
		})
			.catch(this.handleError);
	}

	public addCategory(newCat: Category): Promise<void> {
		console.log('adding category...');

		const url = `${this.apiUrl}/category`;

		var details = {
			'userId': String(this.id),
			'title': newCat.Name,
			'color': newCat.Color.toString(),
			'priorityVal': newCat.DefaultPriority.toString(),
			'dateCreated': '',
			'boardId': String(newCat.BoardId)
		};
		console.log(newCat.DateCreated.toDateString());
		console.log(newCat.DefaultPriority.toString());
		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + '\'' + encodedValue + '\'');
		}
		let body = formBody.join("&");

		return this.http.post(url, body, this.options).toPromise().then((response: any) => {
			console.log("addCategory response:" + response.toString);
		}).catch(this.handleError);
	}

	private GETCategories(args?: any): Observable<Category[]> {
		console.log('requesting categories...');

		const url = `${this.apiUrl}/category?userId=${this.id}`;
		return this.http.get(url).map((response: any) => {
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
					json['default_priority'],
					true,
					false));

				// Populate Categories: Category[] prop in boards
				let isAssigned: boolean = false;
				while (isAssigned == false) {
					while (this.CachedBoards == null
						|| this.CachedBoards == undefined
						|| this.CachedBoards.length == 0) {
					}

					// 2 - find board in cached where id matches cat board_id prop, 
					let b: Board = this.CachedBoards.find((board, index, array) => json['board_id'] == board.DbId);

					// 3 - check if cat already in board, if NOT, add it
					if (b.Categories.find((cat, index, bArray) => {
						return (array[array.length - 1].DbId == cat.DbId)
							&& (array[array.length - 1].BoardId == cat.BoardId);
					}) == undefined) {

						// 4 - add cat to Cat[] prop on board
						b.Categories.push(array[array.length - 1]);
						isAssigned = true;

						console.log('Assigning ' + array[array.length - 1].Name + ' to ' + b.Name);
					}

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
									//console.log('Deleting sample category: ' + cat.Name);
									let index = board.Categories.indexOf(cat);
									board.Categories.splice(index, 1);
								}
							});
						});
					}

				}
			}

			// assign built array to cache
			// if already has cats in cache, delete them
			array.forEach(arrayCat => {
				if (this.checkIfAvailable([this.CachedCats])) {
					let possibleDuplicate: Category = this.CachedCats.find((cacheCat, cacheIndex, cacheArray) => cacheCat.DbId == arrayCat.DbId);
					if (possibleDuplicate != undefined) {
						this.CachedCats.splice(this.CachedCats.indexOf(possibleDuplicate));
					}
				}
			});
			this.CachedCats = array;
			console.log('Categories retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public updateCategory(cat: Category): Promise<void> {
		console.log('updating category...');

		const url = `${this.apiUrl}/category`;

		var details = {
			'userId': String(this.id),
			'categoryId': String(cat.DbId),
			'title': cat.Name,
			'color': cat.Color.toString(),
			'priorityVal': cat.DefaultPriority.toString(),
			'dateCreated': '',
			'boardId': String(cat.DbId)
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + '\'' + encodedValue + '\'');
		}
		let body = formBody.join("&");

		console.log(body);

		return this.http.put(url, body, this.options).toPromise().then((response: any) => {
			console.log("updateCategories response:" + response.toString);
		}).catch(this.handleError);
	}

	public deleteCategory(cat: Category): Promise<void> {
		console.log('deleting category...');

		const url = `${this.apiUrl}/category?categoryId=${cat.DbId}`;
		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('CAT delete: ' + response.toString());
		})
			.catch(this.handleError);
	}

	public addTodo(newTodo: Todo): Promise<void> {
		console.log('adding todo...');

		const url = `${this.apiUrl}/todo`;

		// create req body
		var details = {
			'userId': String(this.id),
			'info': newTodo.Info,
			'categoryId': newTodo.Category.DbId ? String(newTodo.Category.DbId) : '',
			'dateCreated': newTodo.DateCreated.toISOString(),
			'isDone': newTodo.IsDone ? '1' : '0',
			'dateDue': newTodo.DateDue ? newTodo.DateDue.toISOString() : '',
			'dateDone': '',
			'isArchived': newTodo.IsArchived ? '1' : '0',
			'priorityVal': newTodo.Priority.toString(),
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + '\'' + encodedValue + '\'');
		}
		let body = formBody.join("&");

		return this.http.post(url, body, this.options).toPromise().then((response: any) => {
			console.log("addTodo response:" + response.toString);
		}).catch(this.handleError);
	}

	private GETTodos(args?: any): Observable<Todo[]> {
		console.log('requesting todos...');

		const url = `${this.apiUrl}/todo?userId=${this.id}`;
		return this.http.get(url).map((response: any) => {
			console.log('processing todos...');

			let array: Todo[] = [];
			let i: number = 0; // loop counter
			for (let json of response.json()) {
				i++;

				// copy json data to new todo in array
				array.push(new Todo(json['todo_info'],
					null, // cachedCats likely null here, so set it later
					new Date(json['date_created']),
					json['is_done'],
					new Date(json['date_done']),
					json['is_archived'],
					Priority[Priority[json['priority_value']]],
					json['todo_id'],
					json['date_due']));

				// assign todo to a board (and category)
				let isAssigned: boolean = false;
				while (!isAssigned) {
					if (this.CachedBoards != undefined
						&& this.CachedBoards != null
						&& this.CachedCats != undefined
						&& this.CachedCats != null
						&& this.CachedBoards.length >= 0
						&& this.CachedCats.length >= 0) {
						isAssigned = true;

						// 1 - find todo category (and assign)
						while (this.CachedCats == undefined) {
							// Wait for CachedCats to be defined
						}
						let todoCat: Category = this.CachedCats.find((cat, index, array) => {
							return cat.DbId == json['category_id'];
						});
						array[array.length - 1].Category = todoCat;
						console.log('Assigned TODO to CAT: ' + array[array.length - 1].Info + ' to ' + todoCat.Name);

						// 2 - find board whose DbId matches cat's BoardId prop
						while (this.CachedBoards == undefined) {
							// Wait for CachedBoards to be defined
						}
						let b: Board = this.CachedBoards.find((board, index, array) => {
							// (do not search until Cats[] prop on board is not empty/ null)
							while (board.Categories == null || board.Categories.length == 0) {
								console.log('TODOS: Cat[] prop on ' + board.Name + ' unavailable! Waiting...');
							}

							// (board Cats[] not null, can continue with check)
							return board.DbId == todoCat.BoardId;
						});

						// 3 - check if todo already in board, if NOT, add it
						console.log('Checking todo ' + array[array.length - 1].DbId);
						if (b.Todos.find((todo, index, bArray) => {
							return (array[array.length - 1].Category.DbId == todo.Category.DbId)
								&& (array[array.length - 1].DbId == todo.DbId);
						}) == undefined) {

							// 4 - add current todo to that board's Todo[]
							b.Todos.push(array[array.length - 1]);
							isAssigned = true;

							console.log('Assigning ' + array[array.length - 1].Info + ' to ' + b.Name);
						}

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
										//console.log('Deleting sample todo: ' + todo.Info);
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

			// assign built array to cache
			// if already has todos in cache, delete them
			array.forEach(arrayTodo => {
				if (this.checkIfAvailable([this.CachedTodos])) {
					let possibleDuplicate: Todo = this.CachedTodos.find((cacheTodo, cacheIndex, cacheArray) => cacheTodo.DbId == arrayTodo.DbId);
					if (possibleDuplicate != undefined) {
						this.CachedTodos.splice(this.CachedTodos.indexOf(possibleDuplicate));
					}
				}
			});
			this.CachedTodos = array;
			console.log('Todos retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public updateTodo(todo: Todo): Promise<void> {
		console.log('updating todo...');

		const url = `${this.apiUrl}/todo`;

		// create req body
		var details = {
			'userId': String(this.id),
			'todoId': String(todo.DbId),
			'info': todo.Info,
			'categoryId': todo.Category.DbId ? String(todo.Category.DbId) : '',
			'isDone': todo.IsDone ? '1' : '0',
			'dateDue': todo.DateDue ? todo.DateDue.toISOString() : '',
			'dateDone': '',
			'isArchived': todo.IsArchived ? '1' : '0',
			'priorityVal': todo.Priority.toString(),
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + "=" + '\'' + encodedValue + '\'');
		}
		let body = formBody.join("&");

		return this.http.put(url, body, this.options).toPromise().then((response: any) => {
			console.log("updateTodos response:" + response.toString);
		}).catch(this.handleError);
	}

	public deleteTodo(todoId): Promise<void> {
		console.log('deleting todo...');

		//let todoId: number = 66;
		const url = `${this.apiUrl}/todo?todoId=${todoId}`;
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

	private checkIfAvailable(array: any[][]) {
		let val: boolean = true;
		array.forEach(element => {
			if (!(element != undefined && element != null && element.length > 0)) {
				val = false;
			}
		});
		return val;
	}

	public getCurrentBoard(): Observable<any> {
		// return cached if present
		if (this.CurrentBoard != null && this.CurrentBoard != undefined) {
			return Observable.of(this.CurrentBoard);
		}
		else {
			this.isBusy = true;
			console.log('Getting current board...');
			// Retrieve all data first, then pull current board after all concluded
			return this.GETBoards().mergeMap(boards => this.GETCategories(boards).mergeMap(cats => this.GETTodos(cats)
				.map(args => {
					this.isBusy = false;
					return this.CachedBoards[0];
				}).share()));
		}
	}

	public setAsCurrentBoard(board: Board) {
		this.CurrentBoard = board;
	}

	public async getBoards(): Promise<Board[]> {
		console.log('--lowercase getBoards()');
		// if already has cache, return cache
		if (this.checkIfAvailable([this.CachedBoards])) {
			console.log('--getBoards: returning cached boards!');
			return Promise.resolve(this.CachedBoards);
		}
		// if haven't requested, req to return boards
		else if (!this.isBusy) {
			//return this.getCurrentBoard().toPromise().then(args => Promise.resolve(this.CachedBoards));
		}
		await this.waitForArray(this.CachedBoards);
		console.log('--getBoards end');
	}

	public async getCategories(): Promise<Category[]> {
		console.log('--lowercase getcategories()');
		// if already has cache, return cache
		if (this.checkIfAvailable([this.CachedCats])) {
			console.log('--getCategories: returning cached cats! length = ' + this.CachedCats.length);
			return Promise.resolve(this.CachedCats);
		}
		// // if haven't requested, req to return cats
		// else if (!this.isBusy) {
		// 	//return this.getCurrentBoard().toPromise().then(args => Promise.resolve(this.CachedCats));
		// }
		await this.waitForArray(this.CachedCats);
		console.log('--getCats end');
	}

	public async getTodos(): Promise<Todo[]> {
		console.log('--lowercase getTodos()');
		// if already has cache, return cache
		if (this.checkIfAvailable([this.CachedTodos])) {
			console.log('--getTodos: returning cached todos! length = ' + this.CachedTodos.length);
			return Promise.resolve(this.CachedTodos);
		}
		// if haven't requested, req to return todos
		else if (!this.isBusy) {
			//return this.getCurrentBoard().toPromise().then(args => Promise.resolve(this.CachedTodos));
		}
		await this.waitForArray(this.CachedTodos);
		console.log('--getTodos end');
	}

	private waitForArray(array: any[]) {
		while (!this.checkIfAvailable([array])) {
			return array;
		}
	}

	public changeBoard(board: Board): Promise<Board> {
		let boardIndex = this.CachedBoards.indexOf(board);

		if (boardIndex + 1 == this.CachedBoards.length) {
			this.CurrentBoard = this.CachedBoards[0];
		}
		else {
			this.CurrentBoard = this.CachedBoards[boardIndex + 1];
		}

		return Promise.resolve(this.CurrentBoard);
	}

	public openBoard(board: Board): Promise<Board> {
		this.CurrentBoard = board;
		return Promise.resolve(this.CurrentBoard);
	}

	public getColors(): Promise<string[]> {
		return Promise.resolve(ColorArray);
	}
}