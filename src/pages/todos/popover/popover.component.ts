import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TodoService } from '../../../app/todo.service';
import { Todo } from '../../../app/todo';
import { TodoList } from '../todo-list/todo-list.component';

@Component({ //replace with list of categories
    selector: "category-list",
    providers: [TodoService],
    template: `
    <ion-list no-lines>
        <ion-item>
            <ion-checkbox (click)=categoryFilter(Life)></ion-checkbox>
            <ion-label>Life</ion-label>
        </ion-item>
    </ion-list>
    `
})

export class CategorySort{
    todos;
    
    contructor(todoService: TodoService){
        this.todos = todoService.getTodos();
        
    }

    categoryFilter(cate:string){
        
    }
}


@Component({
    selector: "property-list",
    template: `
      <ion-list>
          <ion-item>Priority</ion-item>
          <ion-item>Date Created</ion-item>
      </ion-list>
    `
})

export class PropertySort{
}




@Component({
    selector: 'popover-page',
    template: `
    <ion-list>
        <button ion-item (click)="toggleSort()">Category</button>
        <button ion-item (click)="toggleSort()">Property</button>
    </ion-list>
    <category-list *ngIf="category; else property"></category-list>
    <ng-template #property>
    <property-list></property-list>
    </ng-template>
    `
})

export class PopoverPage{
  category: boolean = true;
  
  toggleSort(){
      this.category=!this.category;
  }
  
}



