import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Category } from '../../category';
import { Priority } from '../../priority';

@Component({
    templateUrl: 'add-category.html'
})

export class AddCategory {
    constructor(public viewCntrl: ViewController){

    }
    
    priority = Priority;
    prior() : Array<string> {
        var keys = Object.keys(this.priority);
        return keys.slice(keys.length / 2);
    }
    
    newCate = new Category(undefined, undefined, undefined);
    onNewCatFormSubmit(){
        this.viewCntrl.dismiss();
    }
}