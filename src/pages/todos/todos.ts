import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TodoList } from './todo-list/todo-list.component'; 
import { PopoverButton } from './popover-button/popover-button';


@Component({
  selector: 'todos-page',
  templateUrl: 'todos.html'
})
export class TodosPage {

  constructor(public navCtrl: NavController) {
   
  }

}