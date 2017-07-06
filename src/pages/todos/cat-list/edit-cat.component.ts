import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';
import { Category } from '../../../app/classes/category';
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

	onEditCatSubmit(cat: Category) {
		this.todoService.updateCategory(cat);
		this.viewCtrl.dismiss();
	}
}
