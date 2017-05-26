import { Component, OnInit, Input } from '@angular/core';
import { TodoService } from '../../../app/todo.service';
import { NavController } from 'ionic-angular';

import { Todo } from '../../../app/todo';
import { Category } from '../../../app/category';
import { Priority } from '../../../app/priority';
import { Board } from '../../../app/board';


@Component({
    selector: 'todo-list',
    templateUrl: 'todo-list.html',
})

export class TodoList implements OnInit {
    private error: any; 
    private currentBoard: Board;

    // this sets colors for the category numbers
    ColorArray: string[];
    
    selectedTodos: Todo[] = [];
    selectActive: boolean = false;
    priority: string[] = ["Low", "Medium", "High"];


    constructor(private todoService: TodoService){
    }

    ngOnInit(): void {
        this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
        this.todoService.getCurrentBoard().then(value => this.currentBoard = value);
    }

    todoPriority(pri: number) : Array<number> {
        let k = pri + 1;
        var priArray = Array(k).fill(2).map((x,i)=>i);
        return priArray;
    }
    
    toggleDetail(todo){
        todo.DetailShown = !todo.DetailShown;
        console.log(this.priority.indexOf("Low"));
    }

    activateEdit(todo){
        todo.EditActive = !todo.EditActive;
    }

    onFormSubmit(todo){
        todo.EditActive = false;
    }

    itemChecked(IsDone,todo){ //run when you click the checkbox
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
        let element = this.currentBoard.Todos[indexes.from];
        this.currentBoard.Todos.splice(indexes.from, 1);
        this.currentBoard.Todos.splice(indexes.to, 0, element);
    }

    activateSelect(todo: Todo){
        this.selectActive = true; //mode that controls ability to select/reorder todos

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
        for (let todo of this.currentBoard.Todos){ //turns everything back to white color
            todo.SelectActive = false;
        }
        this.selectedTodos.length = 0; //empties selectedTodos array
    }

    //adding a new todo
    addTodo: boolean = false;
    newTodo = new Todo(undefined, undefined, undefined, undefined, undefined, false, undefined);
    AddTodo(){
      this.addTodo = !this.addTodo;
    }

    onNewTodoFormSubmit(todo){  
        this.addTodo = !this.addTodo;
        var currentDate = new Date();
        this.newTodo.DateCreated = currentDate;
        //TODO: pass newTodo to server and add to user's array 
    }
}