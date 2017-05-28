import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TodoList } from './todo-list/todo-list.component'; 
import { Todo } from '../../app/todo';
import { Board } from '../../app/board';
import { TodoService } from '../../app/todo.service';
import { Category } from '../../app/category';


@Component({
  selector: 'todos-page',
  templateUrl: 'todos.html'
})
export class TodosPage {
  private todosBoard: Board;

  constructor(private todoService: TodoService){
        this.todoService.getCurrentBoard().then(cBoard => this.todosBoard = cBoard);
    }

  changeBoard(){
    this.todoService.changeBoard().then(nBoard => this.todosBoard = nBoard);
  }
}