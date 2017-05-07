import { Component, OnInit } from '@angular/core';
import { TodoService } from './todo.service';
import { Todo } from './todo';
import { Category } from './category';

@Component({ //replace with list of categories
    selector: "category-list",
    providers: [TodoService],
    template: `
    <ion-list no-lines>
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
            <ion-item (click)="sortPriorityHL()">High to Low</ion-item>
            <ion-item (click)="sortPriorityLH()">Low to High</ion-item>
      </ion-list>
    <ion-list>
        <ion-list-header>Sort by Date</ion-list-header>
        <ion-item (click)="DateCreated()">Date Created</ion-item>
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

    DateCreated(){
        var sortedTodos:Todo[] = this.todos.sort((a,b) => {
            if (a.DateCreated > b.DateCreated){
                return -1;
            }

            if (a.DateCreated < b.DateCreated){
                return 1;
            }

            return 0;
        }

        );
    }

}




@Component({
    selector: 'filter-page',
    template: `
    <ion-list>
        <button ion-item (click)="showCategory()">Category</button>
    </ion-list>
    <category-list *ngIf="category; else priority"></category-list>
    `
})

export class FilterPage{
  category: boolean = true;
  showCategory(){
      this.category = true;
  }
  
  showProperty(){
      this.category = null;
  }
}



