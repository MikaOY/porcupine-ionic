import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Category } from '../../../app/classes/category';
import { Board } from '../../../app/classes/board';
import { TodoService} from '../../../app/services/todo.service';
import { AddCategory } from '../add-category/add-category.component';
import { EditCat } from './edit-cat.component';

@Component({
	selector: 'cat-list',
	templateUrl: 'cat-list.html'
})

export class CatList implements OnInit {
	isWaitOver: boolean = false;

	constructor(public modalCtrl: ModalController, public todoService: TodoService) { }

	ngOnInit() {
		setTimeout(() => this.isWaitOver = true, 5000);
	}

	slothCurrentBoard(): Board {
		return this.todoService.slothGetCurrentBoard();
	}

	presentAddCat() {
		let addCatModal = this.modalCtrl.create(AddCategory);
		addCatModal.present();
	}

	editCat(cat: Category) {
		let editCatModal = this.modalCtrl.create(EditCat, {category: cat});
		editCatModal.present();
	}

	deleteCat(cat: Category) {
		this.todoService.deleteObject(cat);
	}

	sortTodos(mode: string) {
		let sortedTodos = this.slothCurrentBoard().Todos.sort((a, b) => {
			switch(mode) {
				case 'HighToLow':
					if (a.Priority > b.Priority)
						return -1;
					if (a.Priority < b.Priority)
						return 1;
					return 0;

				case 'LowToHigh':
					if (a.Priority > b.Priority)
						return 1;
					if (a.Priority < b.Priority)
						return -1;
					return 0;

				case 'Recent':
					if (a.DateCreated > b.DateCreated)
						return -1;
					if (a.DateCreated < b.DateCreated)
						return 1;
					return 0;

				case 'Oldest':
					if (a.DateCreated > b.DateCreated)
						return 1;
					if (a.DateCreated < b.DateCreated)
						return -1;
					return 0;
			}
		});
		this.todoService.sortTodos(sortedTodos);
	}
}
