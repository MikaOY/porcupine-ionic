import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Category } from '../../category';

@Component({
    templateUrl: 'cat-manager.html',
})

export class CategoryManager implements OnInit{
    constructor(public viewCtrl: ViewController, public params: NavParams, private todoService: TodoService) { }

    private cats: Category[];
    private ColorArray: string[];

    ngOnInit(): void {
        this.todoService.getCategories().then(cats => this.cats = cats);
        this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }
}