import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';

import { Todo } from '../../../app/todo';
import { Category } from '../../../app/category';
import { Priority } from '../../../app/priority';

@Component({
    selector: 'todo-list',
    templateUrl: 'todo-list.html',

})

export class TodoList implements OnInit {
    
    private todos: Todo[]; // see mock data in todo.service.ts
    private cats: Category[];
    
    
    // priors: any[];

    constructor(private todoService: TodoService){
        //this.priors = Object.keys(this.priorities).filter(k => !isNaN(Number(k)));
    }

    ngOnInit(): void {
        this.todoService.getTodos().then(todos => this.todos = todos);
        this.todoService.getCategories().then(categories => this.cats = categories);
        
    }
   

    toggleDetail(todo){
        todo.DetailShown = !todo.DetailShown;
         
    }

    activateEdit(todo){
        todo.EditActive = !todo.EditActive;
    }


    onFormSubmit(todo){
        todo.DetailShown = false;
        todo.EditActive = null;
    }

    itemChecked(IsDone,todo){
        if (IsDone == true){
            //function to find date and control archive
        }
    }
}



