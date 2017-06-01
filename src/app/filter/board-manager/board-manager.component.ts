import { Component, OnInit } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { TodoService } from '../../todo.service';
import { Board } from '../../board';

@Component({
	templateUrl: 'board-manager.html',
})

export class BoardManager implements OnInit{

	userBoards: Board[];
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
}