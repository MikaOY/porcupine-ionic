import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TodoItem } from '../todo-item/todo-item'; //not working

@Component({
  selector: 'todos-page',
  templateUrl: 'todos.html'
})
export class TodosPage {

  constructor(public navCtrl: NavController) {

  }

}
