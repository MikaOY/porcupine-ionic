import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';

import { Todo } from '../../../app/todo';

@Component({
    selector: 'todo-list',
    templateUrl: 'todo-list.html',
})
export class TodoList implements OnInit {
    
    todos: Todo[];

    constructor(private todoService: TodoService){

    }

    ngOnInit(): void {
        this.todoService.getTodos().then(todos => this.todos = todos);
    }
}