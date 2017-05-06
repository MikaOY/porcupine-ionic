import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';

import { Todo } from '../../../app/todo';
import { Category } from '../../../app/category';

@Component({
    selector: 'todo-list',
    templateUrl: 'todo-list.html',

})

export class TodoList implements OnInit {
    
    private todos: Todo[]; // see mock data in todo.service.ts
    private categories: Category[];

    constructor(private todoService: TodoService){
        
    }

    ngOnInit(): void {
        this.todoService.getTodos().then(todos => this.todos = todos);
        this.todoService.getCategories().then(categories => this.categories = categories);
    }

    toggleDetail(todo){
        todo.DetailShown = !todo.DetailShown;
    }

    activateEdit(todo){
        todo.EditActive = !todo.EditActive;
    }

    onDateClicked(){
        console.log("DateClicked");
    }

    onCategoryClicked(){

    }

    onPriorityClicked(){

    }
}



