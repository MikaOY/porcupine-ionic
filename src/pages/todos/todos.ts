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

  private cats: Category[];
  private currentBoard: Board;

  constructor(private todoService: TodoService){

        this.todoService.getCurrentBoard().then(cBoard => this.currentBoard = cBoard).then( () => {
            this.cats = this.currentBoard.Categories;
        });
    }

  changeBoard(){
    console.log("clicked");
    this.todoService.changeBoard().then(cBoard => this.currentBoard = cBoard);
    console.log(this.currentBoard.Name);
  }
  
  

}