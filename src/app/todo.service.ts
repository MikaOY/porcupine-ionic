import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './Category';
import { Priority } from './Priority';

// TODO: replace with DB info
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', new Category('Life', 'red', new Date(2017, 4, 30)), new Date(2017, 4, 30), false, undefined, Priority.Low, false),
                        new Todo('Finish Porcupine', new Category('Code', 'grey', new Date(2017, 3, 26)), new Date(2017, 4, 28), false, undefined, Priority.Medium, false),
                        new Todo('Make moist brownie', null, new Date(2017, 4, 29), true, new Date(2017, 4, 30), Priority.High, false)];

@Injectable()
export class TodoService {

    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }
}