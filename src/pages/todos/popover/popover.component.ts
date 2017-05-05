import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';
import { Todo } from '../../../app/todo';
import { Category } from '../../../app/category';

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
          <button ion-item (click)="sortPriority()">Priority</button>
          <button ion-item (click)="DateCreated()">Date Created</button>
      </ion-list>
    `
})

export class PropertySort{
    private todos: Todo[];
    constructor(private todoService: TodoService){
        this.todoService.getTodos().then(todos => this.todos = todos);
     }
     
    sortPriority(){
        var sortedTodos:Todo[] = this.todos.sort((a,b) => {

            if (a.Priority > b.Priority){
                return -1;
            }

            if (a.Priority < b.Priority){
                return 1;
            }

            return 0;
        }

        );
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
    selector: 'popover-page',
    template: `
    <ion-list>
        <button ion-item (click)="showCategory()">Category</button>
        <button ion-item (click)="showProperty()">Property</button>
    </ion-list>
    <category-list *ngIf="category; else property"></category-list>
    <ng-template #property>
        <property-list></property-list>
    </ng-template>
    `
})

export class PopoverPage{
  category: boolean = true;
  showCategory(){
      this.category = true;
  }
  
  showProperty(){
      this.category = null;
  }
}



