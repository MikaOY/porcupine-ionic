import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { TodoService } from '../../../app/services/todo.service';
import { Board } from '../../../app/classes/board';
import { UnlockPage } from './unlock-page/unlock-page.component';

@Component({
	templateUrl: 'board-manager.html',
	selector: 'board-manager'
})

export class BoardManager {

	isAddBoardActive: boolean = false;
	newBoard: Board = new Board('Dogs', undefined, undefined, undefined, undefined);

	constructor(public modalCtrl: ModalController,
							public todoService: TodoService) { }

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}

	slothSharedBoards(): Board[]{
		return this.todoService.slothGetSharedBoards();
	}

	openBoard(board: Board) {
		this.todoService.setAsCurrentBoard(board);
	}

	unlockBoard(board: Board) {
		let UnlockModal = this.modalCtrl.create(UnlockPage);
		UnlockModal.onDidDismiss(data => {
			board.IsLocked = data;
		})
		UnlockModal.present();
	}

	toggleBoard() {
		this.isAddBoardActive = !this.isAddBoardActive;
	}

	onAddBoardFormSubmit() {
		this.newBoard.DateCreated = new Date();
		this.todoService.addBoard(this.newBoard);
		this.isAddBoardActive = !this.isAddBoardActive;
	}
}
