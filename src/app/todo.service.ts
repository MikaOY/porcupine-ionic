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
const CATS0: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 123456789, 0, true, 0),
new Category('Coding', 2, new Date(2017, 3, 26), 123456789, 0, true, 2),
new Category('Unsorted', 0, null, 123456789, 0, true, 0)];

const TODOS0: Todo[] = [new Todo('Give an alpaca a hug', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13), 123456789),
new Todo('Finish Porcupine', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium, null, 123456789),
new Todo('Make moist brownie', CATS0[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High, null, 123456789),
new Todo('Upload photos to Drive', CATS0[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 22), 123456789),
new Todo('Pet a pug', CATS0[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium, new Date(2016, 5, 30), 123456789)];

// const BOARDS: Board[] = [new Board('Important Things in Life', TODOS0.reverse(), CATS0.reverse(), undefined, undefined),
// new Board('More Things Todo', TODOS0, CATS0, undefined, undefined)];

const ColorArray: string[] = ['#919191', '#ff5c3f', '#ffb523', '#6f9b53', '#1371d6', '#423e7c', '#7606cc', '#c613b4'];

@Injectable()
export class TodoService {
	public CurrentBoard: Board; //TODO: change to behaviorSubject
	public CachedBoards: Board[] = [];
	public CachedTodos: Todo[] = [];
	public CachedCats: Category[] = [];

	private isBusy: boolean = false;

	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http) { }

	/* START public HTTP functions */

	public addBoard(newBoard: Board): Promise<void> {
		console.log('adding board...');

		let id: number = 0;
		const url = `${this.apiUrl}/board`;

		let body = new URLSearchParams();
		body.set('userId', String(id));
		body.set('title', newBoard.Name);
		body.set('dateCreated', 'undefined');
		
		console.log(body.get('userId'));
		console.log(body.get('title'));
		console.log(body.get('dateCreated'));
		console.log("check 1");
		return this.http.post(url, body, this.options)
			.toPromise().then((response: any) => {
				console.log("check 2");
				console.log("addBoard response:" + response.toString);
			}).catch(this.handleError);
	}

	private GETBoards(): Observable<Board[]> {
		console.log('requesting boards...');

		let id: number = 0;
		const url = `${this.apiUrl}/board?userId=${id}`;
	
		return this.http.get(url).map((response: any) => {
			
			console.log('processing boards...');
			let array: Board[] = [];
			for (let json of response.json()) {
				array.push(new Board(json['title'], TODOS0, CATS0, json['date_created'], json['board_id']));
			}

			this.CachedBoards = array;
			this.CurrentBoard = this.CachedBoards[0];
			
			return array;
		}).share()
			.catch(this.handleError);
			
	}

	public updateBoard(board: Board): Promise<void> {
		console.log('updating board...');

		let id: number = 0;
		const url = `${this.apiUrl}/board?userId=${id}`;

		let body = new URLSearchParams();
		body.set('userId', String(id));
		body.set('boardId', board.DbId ? board.DbId.toString() : 'undefined');
		body.set('title', board.Name);
		body.set('dateCreated', 'undefined');

		return this.http.put(url, body, this.options).toPromise().then((response: any) => {
				console.log("updateBoards response:" + response.toString);
			}).catch(this.handleError);
	}

	public deleteBoard(board: Board): Promise<void> {
		console.log('deleting board...');

		let boardId: number = 66;
		const url = `${this.apiUrl}/board?boardId=${boardId}`;
		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('CAT delete: ' + response.toString());
		})
			.catch(this.handleError);
	}

	public addCategory(newCat: Category): Promise<void> {
		console.log('adding category...');

		let id: number = 0;
		const url = `${this.apiUrl}/category`;

		let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
		let options = new RequestOptions({ headers: headers });
		console.log('addcat check 1');
		let body = new URLSearchParams();
		body.set('userId', id.toString());
		body.set('title', newCat.Name);
		body.set('color', newCat.Color.toString());
		body.set('defaultOrder', (newCat.Order ? newCat.Order.toString() : 'undefined'));
		body.set('priorityVal', newCat.DefaultPriority.toString());
		body.set('dateCreated', newCat.DateCreated.toDateString());
		body.set('boardId', newCat.BoardId.toString());

		console.log("ff");
		return this.http.post(url, body, options
			).toPromise().then((response: any) => {
				console.log("addCategory response:" + response.toString);
			}).catch(this.handleError);
	}

	private GETCategories(args?: any): Observable<Category[]> {
		console.log('requesting categories...');

		let id: number = 0;
		const url = `${this.apiUrl}/category?userId=${id}`;
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
					true,
					json['default_order'],
					json['default_priority']));

				// Populate Categories: Category[] prop in boards
				let isAssigned: boolean = false;
				while (isAssigned == false) {
					while (this.CachedBoards == null
						|| this.CachedBoards == undefined
						|| this.CachedBoards.length == 0) {
						//console.log('CATS: CachedBoards unavailable, ' + this.CachedBoards);
					}

					// find board in cached where id matches cat board_id prop, 
					let b: Board = this.CachedBoards.find((board, index, array) => json['board_id'] == board.DbId);
					// add cat to Cat[] prop on board
					b.Categories.push(array[array.length - 1]);
					isAssigned = true;

					//console.log('Assigning ' + array[array.length - 1].Name + ' to ' + b.Name);

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

			this.CachedCats = array;
			console.log('Categories retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public updateCategory(cat: Category): Promise<void> {
		console.log('updating category...');

		let id: number = 0;
		const url = `${this.apiUrl}/category`;

		let body = new URLSearchParams();
		body.set('userId', String(id));
		body.set('categoryId', cat.DbId ? cat.DbId.toString() : 'undefined');
		body.set('title', cat.Name);
		body.set('boardId', cat.BoardId.toString());
		body.set('color', cat.Color.toString());
		body.set('dateCreated', 'undefined');
		body.set('defaultOrder', cat.Order ? cat.Order.toString() : 'undefined');
		body.set('priorityVal', cat.DefaultPriority ? cat.DefaultPriority.toString() : 'undefined');

		return this.http.put(url, body, this.options).toPromise().then((response: any) => {
				console.log("updateCategories response:" + response.toString);
			}).catch(this.handleError);
	}

	public deleteCategory(cat: Category): Promise<void> {
		console.log('deleting category...');

		let catId: number = 66;
		const url = `${this.apiUrl}/category?categoryId=${catId}`;
		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('CAT delete: ' + response.toString());
		})
			.catch(this.handleError);
	}

	//DELETE LATERRRRRRR
	public tempGetTodos(): Promise<Todo[]>{
		return Promise.resolve(TODOS0);
	}

	public addTodo(newTodo: Todo): Promise<void> {
		console.log('adding todo...');

		let id: number = 0;
		const url = `${this.apiUrl}/todo`;

		let body = new URLSearchParams();
		body.set('userId', id.toString());
		body.set('info', newTodo.Info);
		body.set('categoryId', newTodo.Category.DbId ? String(newTodo.Category.DbId) : 'undefined');
		body.set('dateCreated', String(newTodo.DateCreated));
		body.set('isDone', newTodo.IsDone ? '1' : '0');
		body.set('dateDone', newTodo.DateDone ? String(newTodo.DateDone) : 'undefined');
		body.set('isArchived', newTodo.IsArchived ? '1' : '0');
		body.set('priorityVal', String(newTodo.Priority));

		console.log("Info being added:" + body.get('info'));
		return this.http.post(url, body, this.options).toPromise().then((response: any) => {
			console.log("addTodo response:" + response.toString);
		}).catch(this.handleError);
	}

	private GETTodos(args?: any): Observable<Todo[]> {
		console.log('requesting todos...');

		let id: number = 0;
		const url = `${this.apiUrl}/todo?userId=${id}`;
		return this.http.get(url).map((response: any) => {
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

				//console.log('filling Todo[] in CurrentBoard...' + array.length);
				// Populate Todos: Todo[] prop in boards
				let isAssigned: boolean = false;
				while (!isAssigned) {
					if (this.CachedBoards != undefined
						&& this.CachedBoards != null
						&& this.CachedCats != undefined
						&& this.CachedCats != null
						&& this.CachedBoards.length >= 0
						&& this.CachedCats.length >= 0) {
						isAssigned = true;

						// assign todo to a board
						// 1 - find todo category
						while (this.CachedCats == undefined) {
							// Wait for CachedCats to be defined
						}
						let todoCat: Category = this.CachedCats.find((cat, index, array) => {
							return cat.DbId == json['category_id'];
						});

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

						// 3 - add current todo to that board's Todo[]
						b.Todos.push(array[array.length - 1]);
						isAssigned = true;

						//console.log('Assigning ' + array[array.length - 1].Info + ' to ' + b.Name);

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

			this.CachedTodos = array;
			console.log('Todos retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public updateTodo(todo: Todo): Promise<void> {
		console.log('updating todo...');

		let id: number = 0;
		const url = `${this.apiUrl}/todo`;

		let body = new URLSearchParams();
		body.set('userId', String(id));
		body.set('todoId', todo.DbId ? todo.DbId.toString() : 'undefined');
		body.set('info', todo.Info);
		body.set('categoryId', todo.Category.DbId ? todo.Category.DbId.toString() : 'undefined');
		body.set('priorityVal', todo.Priority ? todo.Priority.toString() : 'undefined');
		body.set('dateCreated', 'undefined');
		body.set('isDone', todo.IsDone ? '1' : '0')
		body.set('dateDone', 'undefined');
		body.set('isArchived', todo.IsArchived ? '1' : '0');
		console.log('Im ere');
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
		this.isBusy = true;
		console.log('Getting current board...');
		debugger;
		// Retrieve all data first, then pull current board after all concluded
		return this.GETBoards().mergeMap(boards => this.GETCategories(boards).mergeMap(cats => this.GETTodos(cats)
			.map(args => {
				this.isBusy = false;
				console.log('current todos: ' + this.CachedBoards[0].Todos.length);
				console.log('cucrrent cats: ' + this.CachedBoards[0].Categories.length);
				console.log('current boards: ' + this.CachedBoards[0].Name);
				console.table(this.CachedBoards[0].Todos);
				return this.CachedBoards[0];
			}).share()));

		/*
		this.GETBoards().mergeMap(boards => this.GETCategories(boards).mergeMap(cats => this.GETTodos(cats)))
			.subscribe(args => this.isBusy = false);

		let board: Board = this.CachedBoards[0];
		return Observable.of(board);
		*/
	}

	public async getBoards(): Promise<Board[]> {
		// if already has cache, return cache
		if (this.checkIfAvailable([this.CachedBoards])) {
			Promise.resolve(this.CachedBoards);
		}
		// if haven't requested, req to return boards
		else if (!this.isBusy) {
			return this.getCurrentBoard().toPromise().then(args => Promise.resolve(this.CachedBoards));
		}
		await this.waitForArray(this.CachedBoards);
	}

	public async getCategories(): Promise<Category[]> {
		// if already has cache, return cache
		if (this.checkIfAvailable([this.CachedCats])) {
			Promise.resolve(this.CachedCats);
		}
		// if haven't requested, req to return cats
		else if (!this.isBusy) {
			return this.getCurrentBoard().toPromise().then(args => Promise.resolve(this.CachedCats));
		}
		await this.waitForArray(this.CachedCats);
	}

	public async getTodos(): Promise<Todo[]> {
		// if already has cache, return cache
		if (this.checkIfAvailable([this.CachedTodos])) {
			Promise.resolve(this.CachedTodos);
		}
		// if haven't requested, req to return todos
		else if (!this.isBusy) {
			return this.getCurrentBoard().toPromise().then(args => Promise.resolve(this.CachedTodos));
		}
		await this.waitForArray(this.CachedTodos);
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