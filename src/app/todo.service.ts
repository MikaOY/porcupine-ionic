import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Priority } from './Priority';

// TODO: replace with DB info
const TODOS = [new Todo(new Date(2017, 4, 30), false, undefined, Priority.Low),
                new Todo(new Date(2017, 4, 28), false, undefined, Priority.Medium),
                new Todo(new Date(2017, 4, 29), true, new Date(2017, 4, 30), Priority.High)];

@Injectable()
export class TodoService {

    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }
}