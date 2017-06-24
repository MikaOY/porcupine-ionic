import { Component, OnInit } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { TodoService } from '../../todo.service';
import { Board } from '../../board';
import { SharePage } from './share-page/share-page.component';
import { UnlockPage } from '../../lockable/unlock-page.component';

@Component({
	templateUrl: 'board-manager.html',
})

export class BoardManager implements OnInit {

	showAddBoard: boolean = false;
	constructor(public modalCtrl: ModalController,
		public viewCtrl: ViewController,
		public todoService: TodoService) { }

	ngOnInit() {
		
	}

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}

	slothSharedBoards(): Board[]{
		return this.todoService.slothGetSharedBoards();
	}

	dismissPage() {
		this.viewCtrl.dismiss();
	}

	openBoard(board: Board) {
		this.todoService.setAsCurrentBoard(board);
		this.viewCtrl.dismiss();
	}

	deleteBoard(board: Board) {
		this.todoService.deleteObject(board);
	}

	deleteSharedBoard(board: Board) {
		//TODO: delete
	}

	editBoardActive(board: Board) {
		board.IsEditActive = !board.IsEditActive;
	}

	onEditBoardSubmit(board: Board) {
		this.todoService.updateBoard(board);
		board.IsEditActive = !board.IsEditActive;
	}

	onEditSharedBoardSubmit(board: Board) {
		//TODO: update
		board.IsEditActive = !board.IsEditActive;
	}

	shareBoard(sBoard: Board) {
		let shareModal = this.modalCtrl.create(SharePage, { 'sBoard' : sBoard });
		shareModal.present();
	}

	lockBoard(board: Board){
		board.Lock(board);
		board.IsEditActive = !board.IsEditActive;
	}

	UnlockBoard(board: Board) {
		let UnlockModal = this.modalCtrl.create(UnlockPage); 
		UnlockModal.onDidDismiss(data => {
			board.IsLocked = data;
		})
		UnlockModal.present();
	}

	addBoard() {
		this.showAddBoard = !this.showAddBoard;
	}

	newBoard: Board = new Board('Dogs', undefined, undefined, undefined, undefined);
	onAddBoardFormSubmit() {
		this.newBoard.DateCreated = new Date();
		this.todoService.addBoard(this.newBoard);
		this.showAddBoard = !this.showAddBoard;
	}
}