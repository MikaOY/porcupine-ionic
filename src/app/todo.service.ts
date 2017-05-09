import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './category';
import { Priority } from './priority';

import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

const CATS: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), undefined, undefined, true), 
                            new Category('Code', 2, new Date(2017, 3, 26), undefined, undefined, true),
                            new Category('Unsorted', 0, null, null, null, true)];

// TODO: replace with DB info
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
                        new Todo('Finish Porcupine', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium),
                        new Todo('Make moist brownie', CATS[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High),
                        new Todo('Upload photos to google drive', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
                        new Todo('Pet a pug', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium)];

@Injectable()
export class TodoService {

    private apiUrl: string;

    constructor(private http: Http) { }

    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }

    getCategories(): Promise<Category[]> {
        return Promise.resolve(CATS);
    }

    getTodoList(): Promise<Todo[]> {
        return this.http.get(this.apiUrl)
               .toPromise()
               .then(response => response.json().data as Todo[])
               .catch(this.handleError);
    }

    getTodo(id: number): Promise<Todo> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Todo)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}