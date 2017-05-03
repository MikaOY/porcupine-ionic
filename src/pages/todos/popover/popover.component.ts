import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TodoService } from '../../../app/todo.service';

@Component({ //replace with list of categories
    selector: "category-list",
    template: `<ion-list>
    <ion-item (click)="categoryFilter(Life)">Life</ion-item>
    <ion-item>Code</ion-item>
    <ion-item>Unsorted</ion-item>
</ion-list>
    `
})

export class CategorySort{
    categoryFilter(cate){
        //function to look through and return array
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
  category=true;
  
  toggleSort(){
      this.category=!this.category;
  }
  
}



