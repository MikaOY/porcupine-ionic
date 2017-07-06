import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { Board } from '../../../app/classes/board';
import { TodoService } from '../../../app/services/todo.service';


@Component({
	templateUrl: 'edit-board.html'
})

export class EditBoard implements OnInit {
	editBoard: Board;
	constructor(public todoService: TodoService, public viewCtrl: ViewController, public navParams: NavParams) { }

	ngOnInit() {
		this.editBoard = this.navParams.get('cBoard');
	}

	deleteBoard(board: Board) {
		this.todoService.deleteObject(board);
	}

	deleteSharedBoard(board: Board) {
		//TODO: delete
	}

	onEditBoardSubmit(board: Board) {
		this.todoService.updateBoard(board);
		this.viewCtrl.dismiss();
	}

	onEditSharedBoardSubmit(board: Board) {
		//TODO: update
		board.IsEditActive = !board.IsEditActive;
	}

	shareBoard(sBoard: Board) {

	}

	lockBoard(board: Board){
		board.Lock(board);
		board.IsEditActive = !board.IsEditActive;
	}
}
