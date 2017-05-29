import { Component } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { Board } from '../../board';
import { AddCategory } from './add-category.component';

@Component({
	templateUrl: 'cat-manager.html'
})

export class CategoryManager {
	constructor(public viewCtrl: ViewController,
		public params: NavParams,
		private todoService: TodoService,
		public modalCtrl: ModalController) {
		this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
		this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard);
	}

	private ColorArray: string[];
	private currentBoard: Board;

	dismiss() {
		this.viewCtrl.dismiss();
	}

	presentAddCat() {
		let addCatModal = this.modalCtrl.create(AddCategory);
		addCatModal.present();
	}
}


