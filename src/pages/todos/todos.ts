import { Component, OnInit } from '@angular/core';
import { Board } from '../../app/classes/board';
import { TodoService } from '../../app/services/todo.service';

@Component({
	selector: 'todos-page',
	templateUrl: 'todos.html'
})

export class TodosPage implements OnInit {

	constructor(public todoService: TodoService) { }

	ngOnInit(): void {
		// leave this and currentBoard to initialize all app caches
		// this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard as Board);
	}

	ionViewWillEnter() { 
		this.archiveTodos();
	}

	archiveTodos() {
			// archives todos if more than 24 hours has passed since checked
		if (this.slothCurrentBoard()) {
			for (let todo of this.slothCurrentBoard().Todos) {
				let currentDate = new Date();
				if (todo.IsDone == true && todo.IsArchived == false) {
					let timeDone = currentDate.getTime() - todo.DateDone.getTime();
					todo.IsArchived = timeDone > 86400000 ? true : false;
				}
			}
		}
	}

	slothCurrentBoard(): Board {
		return this.todoService.slothGetCurrentBoard();
	}

	changeBoard(board: Board) {
		this.todoService.nextBoard(board);
	}
}