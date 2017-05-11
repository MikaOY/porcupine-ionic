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
    
    selectedTodos: Todo[] = [];
    selectActive: boolean = false;

    constructor(private todoService: TodoService){
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
        console.log(todo.EditActive);
    }

    onFormSubmit(todo){
        todo.EditActive = false;
        console.log(todo.EditActive);
    }

    itemChecked(IsDone,todo){ //run when you click the checkbox
        console.log(todo.Info + " is " + IsDone);
        if (IsDone == true){
            //function to find date and control archive
            var currentTime = new Date();
            todo.DateDone = currentTime;
        }
        else {
            todo.DateDone = undefined;
        }
    }

    //apparently working?
    changePrior(val: string, todo){
        var pri: Priority = Priority[val];
        todo.Priority = pri;
    } 

    reorderItems(indexes) {
        let element = this.todos[indexes.from];
        this.todos.splice(indexes.from, 1);
        this.todos.splice(indexes.to, 0, element);
    }

    activateSelect(todo: Todo){
        this.selectActive = true; //allows for reordering

        if (todo.SelectActive === true){
            todo.SelectActive = false;
        }
        else {
            todo.SelectActive = true;
            this.selectedTodos.push(todo);
        }
    }

    disableSelect(){
        this.selectActive = false;

        for (let todo of this.todos){
            todo.SelectActive = false;
        }

        this.selectedTodos.length = 0;
    }

    addTodo:boolean = false;
    todo = new Todo(undefined, undefined, undefined, undefined, undefined, undefined, undefined);

    onNewTodoFormSubmit(todo){
        //pass todo to data base    
        this.addTodo = !this.addTodo;
    }

    AddTodo(){
      this.addTodo = !this.addTodo;
    }
}



