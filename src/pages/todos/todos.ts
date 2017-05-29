import { Component } from '@angular/core';
import { Board } from '../../app/board';
import { TodoService } from '../../app/todo.service';

@Component({
	selector: 'todos-page',
	templateUrl: 'todos.html'
})
export class TodosPage {
	currentBoard: Board;

  constructor(public todoService: TodoService){
        this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard, error => console.log("Something happened"));
    }
    
    ionViewWillEnter(){ //archives todos if more than 24 hours has passed since checked
			if (this.currentBoard){
				for (let todo of this.currentBoard.Todos){
					let currentDate = new Date();
					if (todo.IsDone == true && todo.IsArchived == false){
						let timeDone = currentDate.getTime() - todo.DateDone.getTime();
						todo.IsArchived = timeDone > 86400000 ? true : false;
					}
				}
			}
    }

  changeBoard(board) {
		console.log("Current board: " + board);
		this.todoService.changeBoard(board).then(nBoard => this.currentBoard = nBoard);
	}
}