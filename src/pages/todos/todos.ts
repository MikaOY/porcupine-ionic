import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Board } from '../../app/classes/board';
import { TodoService } from '../../app/services/todo.service';
import { SharePage } from './share-page/share-page.component';
import { UnlockPage } from '../side-menu/board-manager/unlock-page/unlock-page.component';

@Component({
	selector: 'todos-page',
	templateUrl: 'todos.html'
})

export class TodosPage implements OnInit {
	isCatRevealed: boolean = false;
	dateToday: Date = new Date();
	constructor(public todoService: TodoService, public modalCtrl: ModalController) { }

	ngOnInit(): void {
		// leave this and currentBoard to initialize all app caches
		// this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard as Board);
	}

	ionViewWillEnter() {
		this.archiveTodos();
		this.dateToday = new Date();
	}

	onSwipe(e){
		if (e.direction == 2) {
			console.log('swiped left');
			this.todoService.nextBoard(this.slothCurrentBoard());
		}
		if (e.direction == 4) {
			console.log('swiped right');
			this.todoService.previousBoard(this.slothCurrentBoard());
		}
	}

	onPress() {

	}

	revealCats() {
		this.isCatRevealed = !this.isCatRevealed;
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

	unlockBoard(board: Board) {
		let UnlockModal = this.modalCtrl.create(UnlockPage);
		UnlockModal.onDidDismiss(data => {
			board.IsLocked = data;
		})
		UnlockModal.present();
	}
}
