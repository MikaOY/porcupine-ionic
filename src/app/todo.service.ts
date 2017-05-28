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

const CATS0: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 0, 2, 0, true),
new Category('Code', 2, new Date(2017, 3, 26), 1, 1, 2, true),
new Category('Unsorted', 0, null, 2, null, 0, true)];
const CATS1: Category[] = [new Category('Pinapples', 1, new Date(2017, 4, 30), 3, null, 0, true),
new Category('Leaf', 2, new Date(2017, 3, 26), 4, 1, 0, true),
new Category('Unsorted', 0, null, 5, null, 1, true)];

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
	public IsSynced: boolean = false;
	public CurrentBoard: Board;
	public CachedBoards: Board[];
	public CachedTodos: Todo[] = [];
	public CachedCats: Category[] = [];

	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

	constructor(private http: Http) { 
		this.CachedBoards = [new Board('Test', null, null, null, null)];
	}

	// HTTP functions

	public initData(): Promise<void> {
		console.log('Init running......');
		return this.getBoards().then(this.initCallback).catch(this.handleError);
	}

	public getBoards(): Promise<Board[]> {
		console.log("requesting boards...");

		let id: number = 0;
		const url = `${this.apiUrl}/board?personId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			let array: Board[] = [];
			for (let json of response.json()) {
				array.push(new Board(json['title'], TODOS0, CATS0, json['date_created'], json['board_id']));
			}

			this.CachedBoards = array;
			this.CurrentBoard = this.CachedBoards[0];
			console.log('Boards retrieved!');
			return array;
		})
		.catch(this.handleError);
	}

	public getCategories(): Promise<Category[]> {
		console.log("requesting categories...");

		let id: number = 0;
		const url = `${ this.apiUrl }/category?personId=${ id }`;
		return this.http.get(url).toPromise().then((response: any) => {
			let array: Category[] = [];
			for (let json of response.json()) {
				array.push(new Category(json['title'],
					json['color'],
					new Date(json['date_created']),
					json['category_id'],
					json['default_order'],
					json['default_priority']));
				if (this.CachedBoards) {
					this.CachedBoards.find((board, index, array) => json['board_id'] == board.DbId)
						.Categories.push(array[array.length - 1]);
				} else {
					console.log('CachedBoards undefined/null!');
				}
			}

			this.CachedCats = array;
			console.log('Categories retrieved!');
			return array;
		}).catch(this.handleError);
	}

	public getTodos(): Promise<Todo[]> {
		console.log("requesting todos...");

		let id: number = 0;
		const url = `${ this.apiUrl }/todo?personId=${ id }`;
		return this.http.get(url).toPromise().then((response: any) => {
			let array: Todo[] = [];
			for (let json of response.json()) {
				array.push(new Todo(json['todo_info'],
					new Category('Testing', null, null, 5),
					new Date(json['date_created']),
					json['is_done'],
					new Date(json['date_done']),
					json['is_archived'],
					Priority.Medium,
					null,
					json['todo_id']));
			}

			this.CachedTodos = array;
			this.CurrentBoard.Todos = array;
			console.log('Todos retrieved!');
			return array;
		}).catch(this.handleError);
	}

	private initCallback(res: any) {
		this.IsSynced = true;
	}

	private extractCategoryData(response: any): Category[] {
		let array: Category[] = [];
		for (let json of response.json()) {
			array.push(new Category(json['title'],
				json['color'],
				new Date(json['date_created']),
				json['category_id'],
				json['default_order'],
				json['default_priority']));
			if (this.CachedBoards) {
				this.CachedBoards.find((board, index, array) => json['board_id'] == board.DbId)
					.Categories.push(array[array.length - 1]);
			} else {
				console.log('CachedBoards undefined/null!');
			}
		}

		this.CachedCats = array;
		console.log('Categories retrieved!');
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

	// Internal class functions

	getCurrentBoard(): Promise<Board> {
		if (this.IsSynced == true) {
			return Promise.resolve(this.CurrentBoard);
		}
		else {
			return this.getBoards().then(array => array[0]).catch(this.handleError);
		}
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