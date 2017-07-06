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
		this.viewCtrl.dismiss();
	}

	onEditBoardSubmit(board: Board) {
		this.todoService.updateBoard(board);
		this.viewCtrl.dismiss();
	}

	lockBoard(board: Board){
		board.Lock(board);
		board.IsEditActive = !board.IsEditActive;
	}
}
