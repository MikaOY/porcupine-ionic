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
  currentBoard: Board;

  constructor(private todoService: TodoService){
        this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard);
    }
    
    ionViewWillEnter(){ //archives todos if more than 24 hours has passed since checked
      for (let todo of this.currentBoard.Todos){
        let currentDate = new Date();
        if (todo.IsDone == true && todo.IsArchived == false){
          let timeDone = currentDate.getTime() - todo.DateDone.getTime();
          todo.IsArchived = timeDone > 86400000 ? true : false;
        }
      }
    }

  changeBoard(){
    this.todoService.changeBoard(this.currentBoard);
  }
}