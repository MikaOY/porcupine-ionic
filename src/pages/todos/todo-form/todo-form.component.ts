import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';

import { Todo } from '../../../app/todo';

@Component({
    selector: 'todo-form',
    templateUrl: 'todo-form.html'
})

export class TodoForm{
    todo: Todo = this.todo;
}