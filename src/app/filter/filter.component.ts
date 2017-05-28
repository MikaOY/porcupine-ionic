import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from 'ionic-angular';

import { ModalPage } from './modal-page';
import { TodoService } from '../todo.service';
import { Todo } from '../todo';
import { Category } from '../category';
import { Board } from '../board';
import { CategoryManager } from './cat-manager/cat-manager.component';
import { LoginPage } from '../login/login.component';

// CATEGORY

@Component({ //replace with list of categories
    selector: "category-list",
    providers: [TodoService],
    template: `
    <ion-list>
        <ion-item>
            <ion-avatar item-left id="alpacatar">
                <img src="../assets/alpacatar.jpeg">
            </ion-avatar>
            <h2>Mr. Paca</h2>
            <button ion-button clear mini id="loginButton" (click)="presentLogin()">Login</button>
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

export class CategorySort implements OnInit{
    private currentBoard: Board;
    
    constructor(private todoService: TodoService, public modalCtrl: ModalController){
    }

     ngOnInit(): void {
        this.todoService.getCurrentBoard().then(cBoard => this.currentBoard = cBoard);
    }

    showCatModal(){
        let catModal = this.modalCtrl.create(CategoryManager);
        catModal.present();
    }

    presentLogin(){
        let loginModal = this.modalCtrl.create(LoginPage);
        loginModal.present();
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
    `
})

export class PropertySort {
    private currentBoard: Board;
    private error: any;
    
    constructor(private todoService: TodoService) {
        this.todoService.getCurrentBoard().then(value => this.currentBoard = value);
     }

    sortPriorityHL(){
        var sortedTodos:Todo[] = this.currentBoard.Todos.sort((a,b) => {

            if (a.Priority > b.Priority){
                return -1;
            }

            if (a.Priority < b.Priority){
                return 1;
            }

            return 0;
        });

    }

    sortPriorityLH(){
        var sortedTodos:Todo[] = this.currentBoard.Todos.sort((a,b) => {

            if (a.Priority > b.Priority){
                return 1;
            }

            if (a.Priority < b.Priority){
                return -1;
            }

            return 0;
        });
    }

    sortRecent(){
        var sortedTodos:Todo[] = this.currentBoard.Todos.sort((a,b) => {
            if (a.DateCreated > b.DateCreated){
                return -1;
            }

            if (a.DateCreated < b.DateCreated){
                return 1;
            }

            return 0;
        });
    }

    sortOldest(){
        var sortedTodos:Todo[] = this.currentBoard.Todos.sort((a,b) => {
            if (a.DateCreated > b.DateCreated){
                return 1;
            }

            if (a.DateCreated < b.DateCreated){
                return -1;
            }

            return 0;
        });
    }

}