import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TodoList } from './todo-list/todo-list.component'; 
import { Todo } from '../../app/todo';

import { TodoService } from '../../app/todo.service';
import { Category } from '../../app/category';


@Component({
  selector: 'todos-page',
  templateUrl: 'todos.html'
})
export class TodosPage {

  private cats: Category[];

  constructor(private todoService: TodoService){
        this.todoService.getCategories().then(categories => this.cats = categories);
    }

  addTodo:boolean = false;
  todo = new Todo(undefined, undefined, undefined, undefined, undefined, undefined, undefined);

   onFormSubmit(todo){
        //pass todo to data base    
        this.addTodo = !this.addTodo;
    }

    AddTodo(){
      this.addTodo = !this.addTodo;
    }

}