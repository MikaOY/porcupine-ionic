import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './Category';
import { Priority } from './Priority';

// TODO: replace with DB info
const TODOS: Todo[] = [new Todo(new Category('Work', new Date(2017, 4, 30)), new Date(2017, 4, 30), false, undefined, Priority.Low),
                new Todo(new Category('School', new Date(2017, 3, 26)), new Date(2017, 4, 28), false, undefined, Priority.Medium),
                new Todo(null, new Date(2017, 4, 29), true, new Date(2017, 4, 30), Priority.High)];

@Injectable()
export class TodoService {

    getTodos(): Promise<Todo[]> {
        return Promise.resolve(TODOS);
    }
}