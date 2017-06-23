import { Component, OnInit } from '@angular/core';
import { Board } from '../../app/board';
import { TodoService } from '../../app/todo.service';
import { Todo } from '../../app/todo';
import { Priority } from '../../app/priority';
import { UserService } from '../../app/user.service';

@Component({
	selector: 'todos-page',
	templateUrl: 'todos.html'
})
export class TodosPage implements OnInit {
	currentBoard: Board;

	constructor(public todoService: TodoService,
							public userService: UserService) { }

	// Leave service calls in init callback!
	ngOnInit(): void {
		//leave this and currentBoard to initialize all app caches
		//this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard as Board);
	}

	ionViewWillEnter() { //archives todos if more than 24 hours has passed since checked
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
		console.log("Current board: " + board.Name);
		this.todoService.nextBoard(board);
		this.userService.getAuthToken();
	}

	doSomething(){
		var todo = new Todo("eat lots of bananas", undefined, new Date(), false, undefined, false, Priority.Low, undefined);
		this.todoService.addTodo(todo);
	}
}