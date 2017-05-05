import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './Category';
import { Priority } from './Priority';

import { Connection, Request } from 'tedious';

const CATS: Category[] = [new Category('Life', 0, new Date(2017, 4, 30), undefined, undefined, true), 
                            new Category('Code', 1, new Date(2017, 3, 26), undefined, undefined, true),
                            new Category('Unsorted', null, null, null, null, true)];

// TODO: replace with DB info
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', CATS[0], new Date(2017, 4, 30), false, undefined, Priority.Low),
                        new Todo('Finish Porcupine', CATS[1], new Date(2017, 4, 28), false, undefined, Priority.Medium),
                        new Todo('Make moist brownie', CATS[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), Priority.High)];



@Injectable()
export class TodoService {

    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }

    getCategories(): Promise<Category[]> {
        return Promise.resolve(CATS);
    }
}