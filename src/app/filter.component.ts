import { Component, OnInit } from '@angular/core';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import { Category } from './category';

@Component({ //replace with list of categories
    selector: "category-list",
    providers: [TodoService],
    template: `
    <ion-list no-lines>
        <ion-list-header>Filter by Category</ion-list-header>
        <ion-item *ngFor="let cat of cats">
            <ion-checkbox [(ngModel)]="cat.IsShown"></ion-checkbox>
            <ion-label>{{cat.Name}}</ion-label>
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
    <ion-list>
        <ion-list-header>Sort by Priority</ion-list-header>
        <button ion-item (click)="sortPriorityHL()">High to Low</button>
        <button ion-item (click)="sortPriorityLH()">Low to High</button>
    </ion-list>
    <ion-list>
        <ion-list-header>Sort by Date</ion-list-header>
        <button ion-item (click)="sortRecent()">Most Recent</button>
        <button ion-item (click)="sortOldest()">Oldest</button>
    </ion-list>
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








