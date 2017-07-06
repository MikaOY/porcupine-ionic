import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Category } from '../../../app/classes/category';
import { Board } from '../../../app/classes/board';
import { TodoService } from '../../../app/services/todo.service';

@Component({
	templateUrl: 'edit-cat.html'
})

export class EditCat implements OnInit {
	editCat: Category;
	constructor(public viewCtrl: ViewController, public navParams: NavParams, public todoService: TodoService) { }

	ngOnInit() {
		this.editCat = this.navParams.get('category');
	}

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}
	onEditCatSubmit(cat: Category) {
		this.todoService.updateCategory(cat);
		this.viewCtrl.dismiss();
	}
}
