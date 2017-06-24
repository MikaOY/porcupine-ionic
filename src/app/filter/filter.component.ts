import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { TodoService } from '../todo.service';
import { Board } from '../board';
import { Category } from '../category';
import { BoardManager } from './board-manager/board-manager.component';
import { UserService } from '../user.service';
import { AddCategory } from './cat-manager/add-category.component';
import { ProfilePage } from '../../pages/profile/profile.component';

@Component({
	selector: 'category-list',
	templateUrl: 'filter.html'
})

export class CategorySort implements OnInit {
	private currentUser: number;
	justWait: boolean = false;

	constructor(private todoService: TodoService,
		public modalCtrl: ModalController,
		private userService: UserService) { }

	ngOnInit(): void {
		setTimeout(() => this.justWait = true, 5000);
	}

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}
	
	slothCurrentBoard(): Board {
		return this.todoService.slothGetCurrentBoard();
	}

	presentAddCat() {
		let addCatModal = this.modalCtrl.create(AddCategory);
		addCatModal.onDidDismiss(data => {
			if (data){
				//this.cats.push(data);
			}
		});
		addCatModal.present();
	}

	editCat(cat: Category) {
		cat.IsEditActive = !cat.IsEditActive;
	}

	onEditCatSubmit(cat: Category) {
		this.todoService.updateCategory(cat);
		cat.IsEditActive = !cat.IsEditActive;
	}

	deleteCat(category: Category) {
		this.todoService.deleteObject(category);
	}
}


@Component({
	selector: 'property-list',
	template: `
    <ion-grid no-padding>
        <ion-row nowrap>
            <ion-col>
                <ion-list no-lines>
                    <ion-list-header>Priority</ion-list-header>
                    <button ion-item menuClose (click)="sortTodos('HighToLow')">!!! to !</button>
                    <button ion-item menuClose (click)="sortTodos('LowToHigh')">! to !!!</button>
                </ion-list>
            </ion-col>
            <ion-col>
                <ion-list no-lines>
                    <ion-list-header>Date</ion-list-header>
                    <button ion-item menuClose (click)="sortTodos('Recent')">Most Recent</button>
                    <button ion-item menuClose (click)="sortTodos('Oldest')">Oldest</button>
                </ion-list>
            </ion-col>
        </ion-row>
    </ion-grid>
    <button ion-item (click)="presentBoards()">Boards</button>
    `
})

export class PropertySort implements OnInit {

	constructor(private todoService: TodoService,
		public modalCtrl: ModalController) { }

	ngOnInit() {}

	slothCurrentBoard(): Board {
		return this.todoService.slothGetCurrentBoard();
	}

	sortTodos(mode: string) {
		let sortedTodos = this.slothCurrentBoard().Todos.sort((a, b) => {
			console.log("mode:" + mode);
			switch(mode) {
				case 'HighToLow':
					if (a.Priority > b.Priority) 
						return -1;
					if (a.Priority < b.Priority) 
						return 1;
					return 0;

				case 'LowToHigh':
					console.log("low to high");
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
		console.log(sortedTodos[0].Info);
		console.log("hi");
		this.todoService.sortTodos(sortedTodos);
	}

	presentBoards() {
		let boardsModal = this.modalCtrl.create(BoardManager);
		boardsModal.present();
	}

}