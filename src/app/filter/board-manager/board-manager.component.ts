import { Component, OnInit } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { TodoService } from '../../todo.service';
import { Board } from '../../board';
import { SharePage } from './share-page/share-page.component';

@Component({
	templateUrl: 'board-manager.html',
})

export class BoardManager implements OnInit {

	userBoards: Board[];
	showAddBoard: boolean = false;
	constructor(public modalCtrl: ModalController,
		public viewCtrl: ViewController,
		public todoService: TodoService) { }

	ngOnInit() {
		this.todoService.getBoards().then(val => this.userBoards = val);
	}

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}

	dismissPage() {
		this.viewCtrl.dismiss();
	}

	openBoard(board) {
		console.log(board.Name + " board opened");
		this.todoService.openBoard(board);
	}

	addBoard() {
		this.showAddBoard = !this.showAddBoard;
	}

	newBoard: Board = new Board("Dogs", undefined, undefined, undefined, undefined);
	onAddBoardFormSubmit() {
		this.newBoard.DateCreated = new Date();
		this.todoService.addBoard(this.newBoard);
		this.userBoards.push(this.newBoard);
		this.showAddBoard = !this.showAddBoard;
	}

	editBoardActive(board) {
		board.editActive = !board.editActive;
	}

	onEditBoardSubmit(board) {
		this.todoService.updateBoard(board);
		board.editActive = !board.editActive;
	}

	shareBoard(sBoard) {
		console.log("share clicked");
		let shareModal = this.modalCtrl.create(SharePage, { "sBoard": sBoard });
		shareModal.present();
	}

	deleteBoard(board) {
		this.todoService.deleteBoard(board);
		this.userBoards.splice(this.userBoards.indexOf(board), 1);
	}
}