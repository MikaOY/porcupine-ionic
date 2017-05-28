import { Component, OnInit } from '@angular/core';
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
export class TodosPage implements OnInit {
	private todosBoard: Board;

	constructor(private todoService: TodoService) { }

	ngOnInit(): void {
		this.todoService.getBoards().then(boards => this.todosBoard = boards[0]);		
	}

	changeBoard() {
		this.todoService.changeBoard().then(nBoard => this.todosBoard = nBoard);
	}
}