import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './category';
import { Priority } from './priority';
import { Board } from './board';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/startWith';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

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

const BOARDS: Board[] =[new Board('Important Things in Life', TODOS0, CATS0),
                        new Board ('More Things Todo', TODOS1, CATS1)]



const ColorArray: string[] = ["#919191","#ff5c3f", "#ffb523", "#6f9b53", "#1371d6", "#423e7c", "#7606cc", "#c613b4"];

@Injectable()
export class TodoService {

    // private apiUrl: string = 'http://localhost:3000';
    // public todosCachedList: Todo[];

    constructor(private http: Http) { }
    public currentBoard: Board = BOARDS[0]
    //public CurrentBoard: BehaviorSubject<Board> = new BehaviorSubject<Board>(BOARDS[1]);
    getTodos(): Promise<Todo[]> { //remove
        return Promise.resolve(TODOS0);
    }

    getBoards(): Promise<Board[]> {
        return Promise.resolve(BOARDS);
    }

    getCurrentBoard(): Promise<Board> {
        return Promise.resolve(this.currentBoard);
    }

    changeBoard(): Promise<Board> {
        this.currentBoard = BOARDS[1];
        return Promise.resolve(this.currentBoard);
    }
    
    getCategories(): Promise<Category[]> { //remove
        return Promise.resolve(CATS0);
    }

    getColors(): Promise<string[]>{
        return Promise.resolve(ColorArray);
    }
    /*
    getTodos(): Promise<Todo[]> {
        const url = `${this.apiUrl}/todo/0`;
        return this.http.get(url)
               .toPromise()
               .then(response => this.todosCachedList = this.convertFromJSONArray(Todo, response.json()) as Todo[])
               .catch(this.handleError);
    }

    convertFromJSONArray(returnClass: any, json: any[]): any[] {
        var array: any[];
        json.forEach(function(obj) { 
            array.push(Todo.fromJSON(JSON.parse(obj)));
        });
        return array;
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
    */
    selectMode: string;
}