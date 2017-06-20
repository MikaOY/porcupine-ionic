import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Board } from '../../app/board';
import { TodoService } from '../../app/todo.service';
import { Todo } from '../../app/todo';
import { Priority } from '../../app/priority';

@Component({
	selector: 'todos-page',
	templateUrl: 'todos.html'
})
export class TodosPage implements OnInit {

	constructor(public todoService: TodoService) { }

	// Leave service calls in init callback!
	ngOnInit(): void {
		
	}

	// archives todos if more than 24 hours has passed since checked
	ionViewWillEnter() {
		let currentBoard: Board;
		this.todoService.getCurrentBoard().subscribe(board => currentBoard = board);

		if (currentBoard) {
			for (let todo of currentBoard.Todos) {
				let currentDate = new Date();
				if (todo.IsDone == true && todo.IsArchived == false) {
					let timeDone = currentDate.getTime() - todo.DateDone.getTime();
					todo.IsArchived = timeDone > 86400000 ? true : false;
				}
			}
		}
	}

	getCurrentBoard() {
		this.todoService.getCurrentBoard().subscribe((board) => {
			return board; 
		})
	}

	changeBoard(board: Board) {
		console.log("Changing from current board: " + board.Name);
		this.todoService.changeBoard(board);
	}

	doSomething() {
		var todo = new Todo("eat lots of bananas", undefined, new Date(), false, undefined, false, Priority.Low, undefined);
		this.todoService.addTodo(todo);
	}
}