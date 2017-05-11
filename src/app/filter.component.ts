import { Component, OnInit } from '@angular/core';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import { Category } from './category';

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
        </ion-item>
    </ion-list>
    <ion-list no-lines>
        <ion-list-header>Filter by Category</ion-list-header>
        <ion-item *ngFor="let cat of cats">
            <ion-checkbox [(ngModel)]="cat.IsShown"></ion-checkbox>
            <ion-label>{{cat.Name}}</ion-label>
        </ion-item>
        <ion-item>
            <ion-checkbox></ion-checkbox>
            <ion-label>
                Archived
                <ion-icon name="archive"></ion-icon>
            </ion-label>
        </ion-item>
    </ion-list>
    
    `
})

export class CategorySort implements OnInit{
    private cats: Category[];

    constructor(private todoService: TodoService){
        
    }

     ngOnInit(): void {
        this.todoService.getCategories().then(cats => this.cats = cats);
    }

}


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

export class PropertySort{
    private todos: Todo[];
    constructor(private todoService: TodoService){
        this.todoService.getTodos().then(todos => this.todos = todos);
     }

    sortPriorityHL(){
        var sortedTodos:Todo[] = this.todos.sort((a,b) => {

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
        var sortedTodos:Todo[] = this.todos.sort((a,b) => {

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
        var sortedTodos:Todo[] = this.todos.sort((a,b) => {
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
        var sortedTodos:Todo[] = this.todos.sort((a,b) => {
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








