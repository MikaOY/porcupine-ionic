import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TodoList } from './todo-list/todo-list.component'; 

@Component({
  selector: 'todos-page',
  templateUrl: 'todos.html'
})
export class TodosPage {

  constructor(public navCtrl: NavController) {

  }

}
