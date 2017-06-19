import { Component, OnInit } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { TodoService } from '../../todo.service';
import { Board } from '../../board';

@Component({
	templateUrl: 'board-manager.html',
})

export class BoardManager implements OnInit{

	userBoards: Board[];
	showAddBoard: boolean = false;
	constructor(public modalCtrl: ModalController,
							public viewCtrl: ViewController,
							public todoService: TodoService) {}

	ngOnInit(){
		this.todoService.getBoards().then(val => this.userBoards = val);
	}

	dismissPage() {
		this.viewCtrl.dismiss();
	}

	openBoard(board){
		console.log(board.Name + " board opened");
		this.todoService.openBoard(board);//should change CurrentBoard in ALL components
	}

	addBoard(){
		this.showAddBoard = !this.showAddBoard;
	}

	newBoard: Board = new Board(undefined, undefined, undefined, undefined, undefined);
	onAddBoardFormSubmit(){
		console.log("Submit board clicked");
		this.newBoard.DateCreated = new Date();
		this.todoService.addBoard(this.newBoard);
	}

	editBoardActive(board){
		board.editActive = !board.editActive;
	}

	onEditBoardSubmit(board){
		console.log("Boardname: " + board.Name);
		this.todoService.updateBoard(board);
		board.editActive = !board.editActive;
	}

	deleteBoard(board){
		this.todoService.deleteBoard(board);
		console.log('deleteboard clicked in board');
	}
}