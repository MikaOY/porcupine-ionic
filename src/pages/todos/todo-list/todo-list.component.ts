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

    
    // this sets colors for the category numbers
    ColorArray: string[] = ["#919191","#ff5c3f", "#ffb523"];
    
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
        var test = new Todo ('hi there', this.cats[0], undefined, false, null, false, Priority.Low);
        test.Priority=Priority.Medium;
        console.log(test.Priority);
    }

    activateEdit(todo){
        todo.EditActive = !todo.EditActive;
        console.log(todo.EditActive);
    }

    onFormSubmit(todo){
        todo.EditActive = false;
        console.log(todo.EditActive);
    }

    itemChecked(IsDone,todo){ //run when you click the checkbox
        if (IsDone == true){
            //function to find date and control archive
        }
        
        console.log("hi");
        for (let todo of this.todos) {
            console.log(todo.Info);
            console.log(todo.Category);
            console.log(todo.Category.Name + "///" + todo.Category.Color);
            console.log("clearrrrrr.......");
        }
    }

    //apparently working?
    changePrior(val: string, todo){
        console.log("Before it was priority " + todo.Priority);
        var pri: Priority = Priority[val];
        todo.Priority = pri;
       
        console.log("This todo is priority " + todo.Priority);
    } 
}

