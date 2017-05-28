import { Component } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Category } from '../../category';
import { Board } from '../../board';
import { AddCategory } from './add-category.component';

@Component({
    templateUrl: 'cat-manager.html'
})

export class CategoryManager{
    constructor(public viewCtrl: ViewController, 
                public params: NavParams, 
                private todoService: TodoService, 
                public modalCtrl: ModalController) { 
        this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
        this.todoService.getCurrentBoard().subscribe(cBoard => this.currentBoard = cBoard);
    }

    private ColorArray: string[];
    private currentBoard: Board;

    dismiss(){
        this.viewCtrl.dismiss();
    }

    presentAddCat(){
        var showBackdrop = true;
        var enableBackdropDismiss = true;
        let addCatModal = this.modalCtrl.create(AddCategory);
        addCatModal.present();
    }
}


