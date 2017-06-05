import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { TodoService } from '../todo.service';
import { Board } from '../board';
import { CategoryManager } from './cat-manager/cat-manager.component';
import { LoginPage } from '../login/login.component';
import { BoardManager } from './board-manager/board-manager.component';
import { UserService } from '../user.service';

// CATEGORY

@Component({ //replace with list of categories
	selector: "category-list",
	providers: [TodoService],
	template: `
    <ion-list>
        <ion-item (click)="showId()">
            <ion-avatar item-left id="alpacatar">
                <img src="../assets/alpacatar.jpeg">
            </ion-avatar>
            <h2>Mr. Paca: {{currentUser}}</h2>
        </ion-item>
    </ion-list>

    <div id="catContainer">
    <ion-list no-lines>
        <ion-list-header>Filter by Category</ion-list-header>
        <button ion-button clear="true" id="addCatButton" (click)="showCatModal()">+</button>
        <ng-container *ngIf="currentBoard">
            <ion-item *ngFor="let cat of currentBoard.Categories">
                <ion-checkbox [(ngModel)]="cat.IsShown"></ion-checkbox>
                <ion-label>{{cat.Name}}</ion-label>
            </ion-item>
        </ng-container>
        <ion-item>
            <ion-checkbox></ion-checkbox>
            <ion-label>
                Archived
                <ion-icon name="archive"></ion-icon>
            </ion-label>
        </ion-item>
    </ion-list>
    </div>
    `
})

export class CategorySort implements OnInit {
	private currentBoard: Board;
	private currentUser: number;

	constructor(private todoService: TodoService,
		public modalCtrl: ModalController,
		private userService: UserService) { }

	ngOnInit(): void {
		//this.userService.getUser().then(val => this.currentUser = val);
		this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard as Board);
	}

	showCatModal() {
		let catModal = this.modalCtrl.create(CategoryManager);
		catModal.present();
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
	private currentBoard: Board;

	constructor(private todoService: TodoService,
		public modalCtrl: ModalController) { }

	ngOnInit() {
		
	}

	sortPriorityHL() {
		this.currentBoard.Todos = this.currentBoard.Todos.sort((a, b) => {

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
		this.currentBoard.Todos = this.currentBoard.Todos.sort((a, b) => {

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
		this.currentBoard = this.todoService.CurrentBoard;
		if (this.currentBoard) {
			this.currentBoard.Todos = this.currentBoard.Todos.sort((a, b) => {
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
		this.currentBoard.Todos = this.currentBoard.Todos.sort((a, b) => {
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