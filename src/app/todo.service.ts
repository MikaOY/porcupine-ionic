import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './Category';
import { Priority } from './Priority';

import { Connection, Request } from 'tedious';


// TODO: replace with DB info
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', new Category('Life', 0, new Date(2017, 4, 30)), new Date(2017, 4, 30), false, undefined, Priority.Low),
                        new Todo('Finish Porcupine', new Category('Code', 1, new Date(2017, 3, 26)), new Date(2017, 4, 28), false, undefined, Priority.Medium),
                        new Todo('Make moist brownie', null, new Date(2017, 4, 29), true, new Date(2017, 4, 30), Priority.High)];

const CATS: Category[] = [new Category('Life', 0, new Date(2017, 4, 30)), new Category('Code', 1, new Date(2017, 3, 26)),];

@Injectable()
export class TodoService {

    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }

    getCategories(): Promise<Category[]> {
        return Promise.resolve(CATS);
    }
}