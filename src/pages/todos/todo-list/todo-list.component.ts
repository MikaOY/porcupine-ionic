import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';

import { Todo } from '../../../app/todo';

@Component({
    selector: 'todo-list',
    templateUrl: 'todo-list.html',

})

export class TodoList implements OnInit {
    
    private todos: Todo[]; // see mock data in todo.service.ts
   

    constructor(private todoService: TodoService){
        
    }

    ngOnInit(): void {
        this.todoService.getTodos().then(todos => this.todos = todos);
    }

    toggleDetail(todo){
        todo.DetailShown = !todo.DetailShown;
    }

    editDetail(todo){
        
    }

    onDateClicked(){
        console.log("DateClicked");
    }

    onCategoryClicked(){

    }

    onPriorityClicked(){

    }
}



