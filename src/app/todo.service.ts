import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './category';
import { Priority } from './priority';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

const CATS: Category[] = [new Category('Life', 1, new Date(2017, 4, 30), 0, true), 
                            new Category('Code', 2, new Date(2017, 3, 26), 1, true),
                            new Category('Unsorted', 0, null, 2, true)];

// TODO: replace with DB info
/*
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low, new Date(2016, 5, 13)),
                        new Todo('Finish Porcupine', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium),
                        new Todo('Make moist brownie', CATS[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), false, Priority.High),
                        new Todo('Upload photos to google drive', CATS[0], new Date(2017, 4, 30), false, undefined, false, Priority.Low),
                        new Todo('Pet a pug', CATS[1], new Date(2017, 4, 28), false, undefined, false, Priority.Medium)];
                        */

@Injectable()
export class TodoService {

    private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

    public cachedTodos: Todo[];
    public cachedCats: Category[];

    selectMode: string;    

    constructor(private http: Http) { }
    /*
    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }
    */
    getCategories(): Promise<Category[]> {
        this.cachedCats = CATS;
        return Promise.resolve(CATS);
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