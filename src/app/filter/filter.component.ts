import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { Category } from '../category';
import { LoginPage } from '../login/login.component';
import { BoardManager } from './board-manager/board-manager.component';
import { UserService } from '../user.service';
import { AddCategory } from './cat-manager/add-category.component';
// CATEGORY

@Component({
	selector: "category-list",
	templateUrl: 'filter.html'
})

export class CategorySort implements OnInit {
	private currentUser: number;
	private cats: Category[];

	constructor(private todoService: TodoService,
		public modalCtrl: ModalController,
		private userService: UserService) { }

	ngOnInit(): void {
		//this.userService.getUser().then(val => this.currentUser = val);

		setTimeout(() => {
			this.todoService.getCategories().then(val => this.cats = val);
		}, 5000);
	}

	presentAddCat() {
		let addCatModal = this.modalCtrl.create(AddCategory);
		addCatModal.present();
	}

	editCat(cat: Category) {
		cat.EditActive = !cat.EditActive;
	}

	onEditCatSubmit(cat) {
		this.todoService.updateCategory(cat);
	}

	deleteCat(category: Category) {
		this.todoService.deleteCategory(category);
	}

	presentLogin() {
		let loginModal = this.modalCtrl.create(LoginPage);
		loginModal.present();
	}

	showId() {
		//this.userService.getUser().then(val => this.currentUser = val);
		console.log("Show Id: The current user is: " + this.currentUser);
	}
}

// PROPERTY

@Component({
	selector: "property-list",
	template: `
    <ion-grid no-padding>
        <ion-row nowrap>
            <ion-col>
                <ion-list no-lines>
                    <ion-list-header>Priority</ion-list-header>
                    <button ion-item menuClose (click)="sortPriorityHL()">!!! to !</button>
                    <button ion-item menuClose (click)="sortPriorityLH()">! to !!!</button>
                </ion-list>
            </ion-col>
            <ion-col>
                <ion-list no-lines>
                    <ion-list-header>Date</ion-list-header>
                    <button ion-item menuClose (click)="sortRecent()">Most Recent</button>
                    <button ion-item menuClose (click)="sortOldest()">Oldest</button>
                </ion-list>
            </ion-col>
        </ion-row>
    </ion-grid>
    <button ion-item (click)="presentBoards()">Boards</button>
    `
})

export class PropertySort implements OnInit {
	private todos: Todo[];

	constructor(private todoService: TodoService,
		public modalCtrl: ModalController) { }

	ngOnInit() {
		setTimeout(() => {
			this.todoService.getTodos().then(val => this.todos = val);
		}, 5000);

	}

	sortPriorityHL() {
		this.todos = this.todos.sort((a, b) => {

			if (a.Priority > b.Priority) {
				return -1;
			}

			if (a.Priority < b.Priority) {
				return 1;
			}

			return 0;
		});

	}

	sortPriorityLH() {
		this.todos = this.todos.sort((a, b) => {

			if (a.Priority > b.Priority) {
				return 1;
			}

			if (a.Priority < b.Priority) {
				return -1;
			}

			return 0;
		});
	}

	sortRecent() {
		if (this.todos) {
			this.todos = this.todos.sort((a, b) => {
				if (a.DateCreated > b.DateCreated) {
					return -1;
				}

				if (a.DateCreated < b.DateCreated) {
					return 1;
				}

				return 0;
			});
		}
		else {
			console.log("LOL CURRENT BOARD DNE");
		}
	}

	sortOldest() {
		this.todos = this.todos.sort((a, b) => {
			if (a.DateCreated > b.DateCreated) {
				return 1;
			}

			if (a.DateCreated < b.DateCreated) {
				return -1;
			}

			return 0;
		});
	}

	presentBoards() {
		let boardsModal = this.modalCtrl.create(BoardManager);
		boardsModal.present();
	}

}