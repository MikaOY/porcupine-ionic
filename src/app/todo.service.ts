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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const CATS0: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 0, true), 
                            new Category('Code', 2, new Date(2017, 3, 26), 1, true),
                            new Category('Unsorted', 0, null, 2, true)];

const CATS1: Category[] = [new Category('Pinapples', 1, new Date(2017, 4, 30), 0, true), 
                            new Category('Leaf', 2, new Date(2017, 3, 26), 1, true),
                            new Category('Unsorted', 0, null, 2, true)];


// TODO: replace with DB info
/*
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13)),
                        new Todo('Finish Porcupine', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium),
                        new Todo('Make moist brownie', CATS[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High),
                        new Todo('Upload photos to google drive', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
                        new Todo('Pet a pug', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium)];
                        */
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

const BOARDS: Board[] =[new Board('Important Things in Life', TODOS0, CATS0),
                        new Board ('More Things Todo', TODOS1, CATS1)]



const ColorArray: string[] = ["#919191","#ff5c3f", "#ffb523", "#6f9b53", "#1371d6", "#423e7c", "#7606cc", "#c613b4"];

@Injectable()
export class TodoService {
    public currentBoard: Board = BOARDS[0];
    
    public cachedTodos: Todo[];
    public cachedCats: Category[];
    private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

    selectMode: string;    

    constructor(private http: Http) { }
    /*
    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }
    */

    getBoards(): Promise<Board[]> {
        return Promise.resolve(BOARDS);
    }

    getCurrentBoard(): Promise<Board> {
        return Promise.resolve(this.currentBoard);
    }

    changeBoard(): Promise<Board> {
        let boardIndex = BOARDS.indexOf(this.currentBoard);

        if (boardIndex + 1 == BOARDS.length){
            this.currentBoard = BOARDS[0];
        }
        else{
            this.currentBoard = BOARDS[boardIndex + 1];
        }
      
        return Promise.resolve(this.currentBoard);
    }
    
    getCategories(): Promise<Category[]> { 
        this.cachedCats = CATS0;
        return Promise.resolve(CATS0);
    }

    getColors(): Promise<string[]>{
        return Promise.resolve(ColorArray);
    }
    
    public getTodos(): Observable<Todo[]> {
        const url = `${this.apiUrl}/todo/0`;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    private extractData(response: any) {
        console.log("extracting...");
        console.log(response.json()[0]['todo_info']); 

        let array: Todo[];
        for (let json of response.json()) {
            let todo = new Todo(json['todo_info'], 
                                this.cachedCats.find(cat => cat.DbId == json['todo_id']),
                                new Date(json['date_created']), 
                                json['is_done'],
                                new Date(json['date_done']),
                                json['is_archived'],
                                Priority.Medium,
                                null,
                                json['todo_id']);
            array.push(todo);
        }

        this.cachedTodos = array;
        return array;
    }

    private handleError (error: Response | any) {
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
        return Observable.throw(errMsg);
    }    
}