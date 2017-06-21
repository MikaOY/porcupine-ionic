import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { Board } from '../board';
import { Category } from '../category';
import { LoginPage } from '../login/login.component';
import { BoardManager } from './board-manager/board-manager.component';
import { UserService } from '../user.service';
import { AddCategory } from './cat-manager/add-category.component';

@Component({
	selector: "category-list",
	templateUrl: 'filter.html'
})

export class CategorySort implements OnInit {
	private currentUser: number;
	private boards: Board[];

	justWait: boolean = false;

	constructor(private todoService: TodoService,
		public modalCtrl: ModalController,
		private userService: UserService) { }

	ngOnInit(): void {
		//this.userService.getUser().then(val => this.currentUser = val);

		setTimeout(() => {
			this.justWait = true;
			this.todoService.getBoards().then(val => this.boards = val);
		}, 5000);
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

	onEditCatSubmit(cat) {
		this.todoService.updateCategory(cat);
		cat.IsEditActive = !cat.IsEditActive;
	}

	deleteCat(category: Category) {
		this.todoService.deleteObject(category);
		//this.cats.splice(this.cats.indexOf(category),1);
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