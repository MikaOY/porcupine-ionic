import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './category';
import { Priority } from './priority';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const CATS: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 0), 
                            new Category('Code', 2, new Date(2017, 3, 26), 1),
                            new Category('Unsorted', 0, null, 2)];

// TODO: replace with DB info
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13)),
                        new Todo('Finish Porcupine', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium),
                        new Todo('Make moist brownie', CATS[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High),
                        new Todo('Upload photos to google drive', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
                        new Todo('Pet a pug', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium)];

@Injectable()
export class TodoService {

    // private apiUrl: string = 'http://localhost:3000';
    // public todosCachedList: Todo[];

    constructor(private http: Http) { }
    
    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }
    
    getCategories(): Promise<Category[]> {
        return Promise.resolve(CATS);
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