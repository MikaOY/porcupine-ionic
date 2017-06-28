import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { TodoService } from '../../app/services/todo.service';
import { Board } from '../../app/classes/board';
import { Category } from '../../app/classes/category';
import { BoardManager } from './board-manager/board-manager.component';
import { UserService } from '../../app/services/user.service';
import { AddCategory } from './add-category/add-category.component';

@Component({
	selector: 'side-menu',
	templateUrl: 'side-menu.html'
})

export class SideMenu implements OnInit {
	isWaitOver: boolean = false;

	constructor(private todoService: TodoService,
							public modalCtrl: ModalController,
							private userService: UserService) { }

	ngOnInit(): void {
		setTimeout(() => this.isWaitOver = true, 5000);
	}

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}
	
	slothCurrentBoard(): Board {
		return this.todoService.slothGetCurrentBoard();
	}

	presentAddCat() {
		let addCatModal = this.modalCtrl.create(AddCategory);
		addCatModal.present();
	}

	editCat(cat: Category) {
		cat.IsEditActive = !cat.IsEditActive;
	}

	onEditCatSubmit(cat: Category) {
		this.todoService.updateCategory(cat);
		cat.IsEditActive = !cat.IsEditActive;
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

	presentBoards() {
		let boardsModal = this.modalCtrl.create(BoardManager);
		boardsModal.present();
	}
}