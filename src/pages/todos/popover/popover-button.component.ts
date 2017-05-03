
import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../popover/popover.component'; 


@Component({
  selector: 'popover-button',
  template: `<button ion-button id="filterButton" clear="true" (click)=popoverFilter($event)>Filter By</button>`
})

export class PopoverButton{

    constructor(public popoverCtrl:PopoverController){}

    popoverFilter(myEvent){
      let popover = this.popoverCtrl.create(PopoverPage);
      popover.present({
      ev: myEvent
    });
    }
}