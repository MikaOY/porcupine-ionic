import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import { environment } from '../../environments/environment';

import { Todo } from '../classes/todo';
import { Category } from '../classes/category';
import { Priority } from '../classes/priority';
import { Board } from '../classes/board';
import { User } from '../classes/user';
import { Permission } from '../classes/permission';
import { DbCompatible } from '../interfaces/db-compatible.interface';
import { UserService } from './user.service';

@Injectable()
export class TodoService {
	public CurrentBoard: Board;
	public CachedBoards: Board[] = [];
	public CachedCats: Category[] = [];
	public CachedTodos: Todo[] = [];
	public CachedSharedBoards: Board[] = [];

	private id: number = 0;
	private token: string;
	private isBusy: boolean = false;

	constructor(private http: Http, private userService: UserService) {
		// TODO remove: bypass login
		this.userService.getUser('594c8b1cc3954a4865ef9bc9').then((user) => {
			while (this.isBusy == false) {
				this.getCurrentBoard();
			}
		});
	}

	private getReqOptions(reqType: string): Promise<RequestOptions> {
		let hds;
		let ops: RequestOptions;
		if (this.token == undefined) {
			console.log('getReqOptions: Todo service token undefined, getting one');
			this.token = this.userService.accessToken;
			console.log('getReqOptions: todo service access token' + this.token);
			switch (reqType.toLowerCase()) {
				case 'get':
					hds = new Headers({ authorization: this.token });
					console.log('getReqOptions: returning header for get req');
					break;
				default:
					hds = new Headers({ authorization: this.token, 'Content-Type': 'application/x-www-form-urlencoded' });
					break;
			}
			ops = new RequestOptions({ headers: hds });
			console.log('getReqOptions: returning something');
			return Promise.resolve(ops);
		}
		else {
			console.log("getReqOptions: Token already have, returning " + this.token);
			switch (reqType.toLowerCase()) {
				case 'get':
					hds = new Headers({ authorization: this.token });
					break;
				default:
					hds = new Headers({ authorization: this.token, 'Content-Type': 'application/x-www-form-urlencoded' });
					break;
			}
			ops = new RequestOptions({ headers: hds });
			return Promise.resolve(ops);
		}
	}

	private removeCacheDuplicates(array, cacheArray) {
		array.forEach(dbObj => {
			if (this.checkIfAvailable([cacheArray])) {
				let possibleDuplicate: Board = cacheArray.find((cacheB, cacheIndex, cacheArr) => cacheB.DbId == dbObj.DbId);
				if (possibleDuplicate != undefined) {
					cacheArray.splice(cacheArray.indexOf(possibleDuplicate));
				}
			}
		});
	}

	// HTTP FUNCTIONS //

	private POSTBoard(newBoard: Board): Promise<void> {
		console.log('adding board...');

		this.CachedBoards.push(newBoard);

		const url = `${environment.apiUrl}/board`;
		var details = {
			'userId': String(this.id),
			'title': newBoard.Name,
			'dateCreated': '',
		};
		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');

		return this.http.post(url, body, this.getReqOptions('post')).toPromise().then((response: any) => {
			console.log('addBoard response:' + response.toString());
			return null;
		}).catch(this.handleError);
	}

	private GETBoards(): Observable<Board[]> {
		console.log('GETBoards: requesting boards...');

		const url = `${environment.apiUrl}/board?userId=${this.id}`;
		console.log('GETBoards:' + url);
		return Observable.fromPromise(this.getReqOptions('get').then( reqOps => {
			console.log('GETBoards: reqOp headers = ' + reqOps.headers.get("authorization"));
			return this.http.get(url, reqOps).map((response: any) => {

				console.log('GETBoards: processing boards...');

				let array: Board[] = [];
				for (let json of response.json()) {
					array.push(new Board(json['board_title'], [], [], json['board_date_created'],
						json['board_id'], undefined, undefined, json['person_id_board']));

					// populate Permissions[] in board
					this.GETBoardPerms(array[array.length - 1]).then((perms) => {
						array[array.length - 1].Permissions = perms;
					});
				}

			// assign built array to cache
			// BEFORE: if already has boards in cache, delete them
			this.removeCacheDuplicates(array, this.CachedBoards);

				this.CachedBoards = array;
				this.CurrentBoard = this.CachedBoards[0];
				console.log('GETBoards: Boards retrieved!');
				return array;
			}).share();
		})).catch(this.handleError);
	}

	private GETBoardPerms(board: Board): Promise<Permission[]> {
		console.log('getting board permissions...');

		const url = `${environment.apiUrl}/shared?boardId=${board.DbId}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('Processing board permissions...');
			let array: Permission[] = [];
			for (let json of response.json()) {
				array.push(new Permission(new User(json['person_id'], json['fname'], json['lname'], json['username'], json['person_email']),
					json['is_view_only']));
			}
			console.log('Board permissions retrieved!');
			array.forEach((perm) => {
				console.log(perm.User.Email);
			});
			return array;
		});
	}

	private PUTBoard(board: Board): Promise<void> {
		console.log('updating board...');

		const url = `${environment.apiUrl}/board`;
		var details = {
			'userId': String(this.id),
			'title': board.Name,
			'boardId': board.DbId,
			'dateCreated': ''//board.DateCreated.toISOString()
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');

		return this.http.put(url, body, this.getReqOptions('put')).toPromise().then((response: any) => {
			console.log('updateBoards response:' + response.toString());
			return null;
		}).catch(this.handleError);
	}

	// actual delete
	/*private deleteBoard(board: Board): Promise<void> {
		console.log('deleting board...');

		const url = `${environment.apiUrl}/board?boardId=${board.DbId}`;
		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('BOARD delete: ' + response.toString());
		})
			.catch(this.handleError);
	}*/

	private POSTCategory(newCat: Category): Promise<void> {
		console.log('adding category...');

		this.CurrentBoard.Categories.push(newCat);
		this.CachedCats.push(newCat);

		const url = `${environment.apiUrl}/category`;
		var details = {
			'userId': String(this.id),
			'title': newCat.Name,
			'color': newCat.Color.toString(),
			'priorityVal': '0',//newCat.DefaultPriority.toString(),
			'dateCreated': '',
			'boardId': String(newCat.BoardId)
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');

		console.log(body);

		return this.http.post(url, body, this.getReqOptions('post')).toPromise().then((response: any) => {
			console.log('addCategory response:' + response.toString());
			return null;
		}).catch(this.handleError);
	}

	private GETCategories(args?: any): Observable<Category[]> {
		console.log('requesting categories...');

		const url = `${environment.apiUrl}/category?userId=${this.id}`;
		return this.http.get(url).map((response: any) => {
			console.log('processing categories...');

			let array: Category[] = [];
			let i: number = 0;
			for (let json of response.json()) {
				i++;
				array.push(new Category(json['category_title'],
					json['color'],
					new Date(json['category_date_created']),
					json['category_id'],
					json['board_id_category'],
					json['category_priority'],
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
					let b: Board = this.CachedBoards.find((board, index, array) => json['board_id_category'] == board.DbId);

					// 3 - check if cat already in board, if NOT, add it
					if (b.Categories.find((cat, index, bArray) => {
						return (array[array.length - 1].DbId == cat.DbId)
							&& (array[array.length - 1].BoardId == cat.BoardId);
					}) == undefined) {

						// 4 - add cat to Cat[] prop on board
						b.Categories.push(array[array.length - 1]);
						isAssigned = true;

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
			// BEFORE: if already has cats in cache, delete them
			this.removeCacheDuplicates(array, this.CachedCats);

			this.CachedCats = array;
			console.log('Categories retrieved!');
			return array;
		}).catch(this.handleError);
	}

	private PUTCategory(cat: Category): Promise<void> {
		console.log('updating category...');

		const url = `${environment.apiUrl}/category`;
		var details = {
			'userId': String(this.id),
			'categoryId': String(cat.DbId),
			'title': cat.Name,
			'color': cat.Color.toString(),
			'priorityVal': '0', // TODO cat.DefaultPriority.toString(),
			'dateCreated': '',
			'boardId': String(cat.DbId)
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');

		return this.http.put(url, body, this.getReqOptions('put')).toPromise().then((response: any) => {
			console.log('updateCategories response:' + response.toString());
			return null;
		}).catch(this.handleError);
	}

	// actual delete
	/*private deleteCategory(cat: Category): Promise<void> {
		console.log('deleting category...');

		const url = `${environment.apiUrl}/category?categoryId=${cat.DbId}`;
		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('CAT delete: ' + response.toString());
		})
			.catch(this.handleError);
	}*/

	private POSTTodo(newTodo: Todo): Promise<void> {
		console.log('adding todo...');

		this.CurrentBoard.Todos.push(newTodo);
		this.CachedTodos.push(newTodo);

		const url = `${environment.apiUrl}/todo`;
		// create req body
		var details = {
			'userId': String(this.id),
			'info': newTodo.Info,
			'categoryId': newTodo.Category.DbId ? String(newTodo.Category.DbId) : '',
			'dateCreated': '',//newTodo.DateCreated.toISOString()
			'isDone': newTodo.IsDone ? '1' : '0',
			'dateDue': '',//newTodo.DateDue ? newTodo.DateDue.toISOString() : ''
			'dateDone': '',
			'isArchived': newTodo.IsArchived ? '1' : '0',
			'priorityVal': '0', // TODO
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');
		console.log(body);

		return this.http.post(url, body, this.getReqOptions('post')).toPromise().then((response: any) => {
			console.log('addTodo response:' + response.toString());
			return null;
		}).catch(this.handleError);
	}

	private GETTodos(args?: any): Observable<Todo[]> {
		console.log('requesting todos...');

		const url = `${environment.apiUrl}/todo?userId=${this.id}`;
		return this.http.get(url).map((response: any) => {
			console.log('processing todos...');

			let array: Todo[] = [];
			let i: number = 0; // loop counter
			for (let json of response.json()) {
				i++;

				// copy json data to new todo in array
				array.push(new Todo(json['todo_info'],
					null, // cachedCats likely null here, so set it later
					new Date(json['todo_date_created']),
					json['is_done'],
					new Date(json['date_done']),
					json['is_archived'],
					Priority[Priority[json['todo_priority']]],
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
							return cat.DbId == json['category_id_todo'];
						});
						array[array.length - 1].Category = todoCat;

						// 2 - find board whose DbId matches cat's BoardId prop
						while (this.CachedBoards == undefined) {
							// Wait for CachedBoards to be defined
						}
						let b: Board = this.CachedBoards.find((board, index, bArray) => {
							// (do not search until Cats[] prop on board is not empty/ null)
							while (board.Categories == null || board.Categories.length == 0) {
								console.log('TODOS: Cat[] prop on ' + board.Name + ' unavailable! Waiting...');
							}
							// board Cats[] not null, can continue with check
							return board.DbId == todoCat.BoardId;
						});

						//console.log('Passed it');
						// 3 - check if todo already in board, if NOT, add it
						if (b.Todos.find((todo, index, bArray) => {
							return (array[array.length - 1].Category.DbId == todo.Category.DbId)
								&& (array[array.length - 1].DbId == todo.DbId);
						}) == undefined) {

							// 4 - add current todo to that board's Todo[]
							b.Todos.push(array[array.length - 1]);
							isAssigned = true;

						}
						//console.log('Passed 3');
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
			this.removeCacheDuplicates(array, this.CachedTodos);

			this.CachedTodos = array;
			console.log('Todos retrieved!');

			this.CachedBoards.forEach(board => {
				board.Todos.forEach(todo => {
					console.log(board.Name + ': ' + todo.Info);
				});
			});

			return array;
		}).catch(this.handleError);
	}

	private PUTTodo(todo: Todo): Promise<void> {
		console.log('updating todo...');

		const url = `${environment.apiUrl}/todo`;
		// create req body
		var details = {
			'userId': String(this.id),
			'todoId': String(todo.DbId),
			'info': todo.Info,
			'categoryId': todo.Category.DbId ? String(todo.Category.DbId) : '',
			'isDone': todo.IsDone ? '1' : '0',
			'dateDue': '',//todo.DateDue ? todo.DateDue.toISOString() : ''
			'dateDone': '',
			'isArchived': todo.IsArchived ? '1' : '0',
			'priorityVal': '0',//todo.Priority.toString(),
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');
		console.log(body);

		return this.http.put(url, body, this.getReqOptions('put')).toPromise().then((response: any) => {
			console.log('updateTodos response:' + response.toString());
			return null;
		}).catch(this.handleError);
	}

	// actual delete
	/*private deleteTodo(todo: Todo): Promise<void> {
		const url = `${environment.apiUrl}/todo?todoId=${todo.DbId}`;

		return this.http.delete(url).toPromise().then((response: any) => {
			console.log('TODO delete: ' + response.toString());
		})
			.catch(this.handleError);
	}*/

	// delete method that just updates prop
	public PUTDeleteObject(obj: DbCompatible): Promise<void> {

		const url = `${environment.apiUrl}/${obj.constructor.name.toLowerCase()}/delete`;
		// create req body
		let idName: string = obj.constructor.name.toLowerCase() + 'Id';
		console.log('deleting...' + idName);
		var details = {
			'userId': String(this.id),
			[idName]: String(obj.DbId)
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');

		// delete obj from cache
		switch (idName) {
			case 'todoId':
				this.CurrentBoard.Todos.splice(this.CurrentBoard.Todos.indexOf(obj as Todo));
				this.CachedTodos.splice(this.CachedTodos.indexOf(obj as Todo));
				break;
			case 'categoryId':
				this.CurrentBoard.Categories.splice(this.CurrentBoard.Categories.indexOf(obj as Category));
				this.CachedCats.splice(this.CachedCats.indexOf(obj as Category));

				break;
			case 'boardId':
				this.CachedBoards.splice(this.CachedBoards.indexOf(obj as Board));
				break;
		}

		return this.http.put(url, body, this.getReqOptions('put')).toPromise().then((response: any) => {
			console.log('delete ' + idName + ' response: ' + response.toString());
			return null;
		}).catch(this.handleError);
	}

	public PUTRestoreObject(obj: DbCompatible): Promise<void> {

		const url = `${environment.apiUrl}/${obj.constructor.name.toLowerCase()}/restore`;
		// create req body
		let idName: string = obj.constructor.name.toLowerCase() + 'Id';
		console.log('restoring...' + idName);
		var details = {
			'userId': String(this.id),
			[idName]: String(obj.DbId)
		};

		let formBody = [];
		for (var property in details) {
			var encodedKey = encodeURIComponent(property);
			var encodedValue = encodeURIComponent(details[property]);
			formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
		}
		let body = formBody.join('&');
		console.log(body);

		return this.http.put(url, body, this.getReqOptions('put')).toPromise().then((response: any) => {
			console.log('Restore ' + idName + ' ' + obj.DbId + ' ' + response.toString());
			// refresh cache by getting all data again
			this.getCurrentBoard();
			return null;
		}).catch(this.handleError);
	}

	// TODO: remove for prod
	public raiseTheDead(): Promise<void> {
		const url = `${environment.apiUrl}/restore/all`;

		let body: string = '';
		return this.http.put(url, body, this.getReqOptions('put')).toPromise().then((response: any) => {
			console.log('Restore all: ' + response.toString());

			// refresh cache by getting all data again
			this.getCurrentBoard(true);
			return null;
		}).catch(this.handleError);
	}

	public POSTShare(sharees: Permission[], board: Board, note?: string) {
		console.log('Sharing board in service');

		// TODO: send note to recipients
		const url = `${environment.apiUrl}/shared`;
		sharees.forEach(sharee => {
			// get user by email first
			this.userService.GETUserByEmail(sharee.User.Email).then((user) => {
				// then create req body
				var details = {
					'boardId': String(board.DbId),
					'recipientId': user.DbId,
					'isViewOnly': sharee.IsViewOnly ? '1' : '0',
					'note': note ? note : '',
					'sharerId': String(this.id),
					'ownerId': String(board.OwnerId)
				};

				let formBody = [];
				for (var property in details) {
					var encodedKey = encodeURIComponent(property);
					var encodedValue = encodeURIComponent(details[property]);
					formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
				}
				let body = formBody.join('&');
				console.log(body);

				return this.http.post(url, body, this.getReqOptions('post')).toPromise().then((response: any) => {
					console.log('share to response:' + response.toString());
					return null;
				}).catch(this.handleError);
			});
		});
	}

	private GETShared(args: any): Observable<Board[]> {
		console.log('requesting shared...');

		const url = `${environment.apiUrl}/shared?userId=${this.id}`;
		return this.http.get(url).map((response: any) => {

			console.log('processing shared...');

			// for each row,
			// check if new board => create + add to boards
			// check if new cat => create + add to cats
			// check if new todo => create + add to todos
			let boardArray: Board[] = [];
			let catArray: Category[] = [];
			let todoArray: Todo[] = [];
			let i: number = 0;
			for (let json of response.json()) {
				i++;
				// boards
				// add board to cache if first index, or if boards available and doesn't have it already
				if ((i == 1) ||
					(this.checkIfAvailable([boardArray])
						&& boardArray.find((board, index, bArray) => board.DbId == json['board_id']) == undefined)) {

					boardArray.push(new Board(json['board_title'], [], [], json['board_date_created'], json['board_id'],
						json['is_view_only'] as boolean, json['sharer_id'], json['owner_id']));
				}

				// cats
				// (see boards above)
				if ((i == 1) ||
					(this.checkIfAvailable([catArray])
						&& catArray.find((cat, index, arrayB) => cat.DbId == json['category_id']) == undefined)) {

					// find board that category belongs to
					let b: Board = boardArray.find((boardB, index, arrayC) => boardB.DbId == json['board_id_category']);
					if (b == undefined) {
						console.log('Shared: Did not find board for cat!')
					}
					// create cat based on json data
					let cat = new Category(json['category_title'],
						json['color'],
						new Date(json['category_date_created']),
						json['category_id'],
						json['board_id_category'],
						json['category_priority'],
						true,
						false);

					// push new cat to Cats[] prop of board it belongs to AND local catsArray
					b.Categories.push(cat);
					catArray.push(cat);
				}

				// todos
				// (see boards above)
				if ((i == 1) ||
					(this.checkIfAvailable([todoArray])
						&& todoArray.find((todo, index, arrayT) => todo.DbId == json['todo_id']) == undefined)) {

					// create todo based on json data
					let todo = new Todo(json['todo_info'],
						null, // cachedCats likely null here, so set it later
						new Date(json['todo_date_created']),
						json['is_done'],
						new Date(json['date_done']),
						json['is_archived'],
						Priority[Priority[json['todo_priority']]],
						json['todo_id'],
						json['date_due']);

					// find cat todo belongs to
					let c: Category = catArray.find((cat, index, arrayC) => cat.DbId == json['category_id_todo']);
					if (c == undefined) {
						console.log('Shared: Did not find cat for todo!' + todo.Info);
					}
					todo.Category = c;

					// find board that todo's cat belongs to
					let b: Board = boardArray.find((boardB, index, arrayB) => boardB.DbId == todo.Category.BoardId);
					if (b == undefined) {
						console.log('Shared: Did not find board for cat of todo!' + todo.Info)
					}

					// push new cat to Cats[] prop of board it belongs to AND local catsArray
					b.Todos.push(todo);
					todoArray.push(todo);
				}
			}

			// assign built array to cache
			// BEFORE: if already has boards in cache, delete them
			this.removeCacheDuplicates(boardArray, this.CachedSharedBoards);

			this.CachedSharedBoards = boardArray;
			console.log('Shared retrieved!');
			return boardArray;
		}).catch(this.handleError);
	}

	public DELETEShare(perm: Permission, board: Board) {
		console.log('unsharing board...');

		this.userService.GETUserByEmail(perm.User.Email).then((user) => {
			// first check if user CAN unshare recipient
			if (board.IsViewOnly) {
				console.log('Board view only! Cannot unshare!');
			} else {
				// unshare if can
				const url = `${environment.apiUrl}/shared?boardId=${board.DbId}&recipientId=${user.DbId}&userId=${this.id}`;
				console.log(url);

				return this.http.delete(url).toPromise().then((response: any) => {
					console.log('Unshared board ' + board.Name + ' with ' + user.Email + response.toString());
					return null;
				})
					.catch(this.handleError);
			}
		});
	}

	// HTTP HELPERS

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
		console.error('todo.service: Something went wrong!');
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

	// HTTP FUNCTIONS END //

	// COMPONENT METHODS //

	public addBoard(newBoard: Board) {
		if (newBoard) {
			return this.POSTBoard(newBoard);
		}
	}

	public getBoardPerms(b: Board) {
		if (b) {
			return this.getBoardPerms(b);
		}
	}

	public updateBoard(b: Board) {
		if (b) {
			return this.PUTBoard(b);
		}
	}

	public addCategory(c: Category) {
		if (c) {
			return this.POSTCategory(c);
		}
	}

	public updateCategory(c: Category) {
		if (c) {
			return this.PUTCategory(c);
		}
	}

	public addTodo(t: Todo) {
		if (t) {
			return this.POSTTodo(t);
		}
	}

	public updateTodo(t: Todo) {
		if (t) {
			return this.PUTTodo(t);
		}
	}

	public deleteObject(dbObj: DbCompatible) {
		if (dbObj) {
			return this.PUTDeleteObject(dbObj);
		}
	}

	public restoreObject(dbObj: DbCompatible) {
		if (dbObj) {
			return this.PUTRestoreObject(dbObj);
		}
	}

	public shareBoard(pA: Permission[], b: Board, n?: string) {
		if (pA && b) {
			return this.POSTShare(pA, b, n);
		}
	}

	public unshareBoard(p: Permission, b: Board) {
		if (p && b) {
			return this.DELETEShare(p, b);
		}
	}

	public getCurrentBoard(isForce?: boolean): Observable<any> {
		// first find out if HTTP req is needed
		let doRetrieve = true;
		// return cached if present
		if (this.CurrentBoard != null && this.CurrentBoard != undefined) {
			doRetrieve = false;
		}
		// allow force GET
		if (isForce != undefined && isForce == true) {
			doRetrieve = true;
		}

		if (doRetrieve == true) {
			this.isBusy = true;
			console.log('getCurrentBoard: Getting current board...');

			// get user id
			this.userService.getUser().then((user) => {
				this.id = user.DbId;
				console.log('getCurrentBoard: this.id set to ' + this.id);

				// Retrieve all data first, then pull current board after all concluded
				return this.GETBoards().mergeMap(boards =>
					this.GETCategories(boards).mergeMap(cats =>
						this.GETTodos(cats).mergeMap(todos =>
							this.GETShared(todos))
							.map(args => {
								this.isBusy = false;
								return this.CachedBoards[0];
							}).share()));
			});
		} else {
			return Observable.of(this.CurrentBoard);
		}
	}

	public setAsCurrentBoard(board: Board) {
		this.CurrentBoard = board;
	}

	public nextBoard(board: Board) {
		var boardIndex: number;
		if (board.SharerId == undefined && board.OwnerId == undefined) {
			boardIndex = this.CachedBoards.indexOf(board);
			if (boardIndex + 1 == this.CachedBoards.length) {
				this.CurrentBoard = this.CachedSharedBoards[0];
			}
			else {
				this.CurrentBoard = this.CachedBoards[boardIndex + 1];
			}
		}
		else {
			boardIndex = this.CachedSharedBoards.indexOf(board);
			if (boardIndex + 1 == this.CachedSharedBoards.length) {
				this.CurrentBoard = this.CachedBoards[0];
			}
			else {
				this.CurrentBoard = this.CachedSharedBoards[boardIndex + 1];
			}
		}
	}

	public sortTodos(sortedTodos: Todo[]) {
		this.CurrentBoard.Todos = sortedTodos;
	}

	// SLOTH METHODS //

	public slothGetBoards(): Board[] {
		if (this.checkIfAvailable([this.CachedBoards])) {
			return this.CachedBoards;
		}
		else {
			let emptyBoard: Board[] = [];
			return emptyBoard;
		}
	}

	public slothGetSharedBoards(): Board[] {
		if (this.checkIfAvailable([this.CachedSharedBoards])) {
			return this.CachedSharedBoards;
		}
		else {
			let emptyBoard: Board[] = [];
			return emptyBoard;
		}
	}

	public slothGetCats(): Category[] {
		if (this.checkIfAvailable([this.CachedCats])) {
			return this.CachedCats;
		}
		else {
			let emptyCats: Category[] = [];
			return emptyCats;
		}
	}

	public slothGetTodos(): Todo[] {
		if (this.checkIfAvailable([this.CachedTodos])) {
			return this.CachedTodos;
		}
		else {
			let emptyTodos: Todo[] = [];
			return emptyTodos;
		}
	}

	public slothGetCurrentBoard(): Board {
		if (this.CurrentBoard != null && this.CurrentBoard != undefined) {
			return this.CurrentBoard;
		}
		else {
			let emptyBoard: Board;
			return emptyBoard;
		}
	}

	public slothGetBoardPerms(board: Board): Permission[] {
		// if board exists and permissions are defined
		let daBoard: Board = this.CachedBoards.find((b, index, bArray) => b.DbId == board.DbId);
		if (daBoard != undefined && daBoard.Permissions != undefined && daBoard.Permissions.length > 0) {
			return daBoard.Permissions;
		}
		else {
			let emptyPerms: Permission[];
			return emptyPerms;
		}
	}

	// SLOTH METHODS END //

	// COMPONENT METHODS END //
}
