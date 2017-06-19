import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ModalController, NavParams, ViewController } from 'ionic-angular';
import { AddCategory } from './add-category.component';
import { Category } from '../../category';

@Component({
	templateUrl: 'cat-manager.html'
})

export class CategoryManager implements OnInit {
	constructor(public viewCtrl: ViewController,
							public params: NavParams,
							private todoService: TodoService,
							public modalCtrl: ModalController) {}

	ngOnInit(){
		this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
		this.todoService.getCategories().then(val => this.cats = val);
	}

	private ColorArray: string[];
	private cats: Category[];

	dismiss() {
		this.viewCtrl.dismiss();
	}

	presentAddCat() {
		let addCatModal = this.modalCtrl.create(AddCategory);
		addCatModal.present();
	}

	
	editCat(cat: Category){
		cat.EditActive = !cat.EditActive;
	}

	onEditCatSubmit(cat){
		this.todoService.updateCategory(cat);
	}
}


