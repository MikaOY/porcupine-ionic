import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';
import { Category } from '../../category';
import { Board } from '../../board';
import { AddCategory } from './add-category.component';

@Component({
    templateUrl: 'cat-manager.html'
})

export class CategoryManager implements OnInit{
    constructor(public viewCtrl: ViewController, public params: NavParams, private todoService: TodoService, public modalCtrl: ModalController) { }

    private cats: Category[];
    private ColorArray: string[];
    private Boards: Board[];
    private currentBoard: Board;

    ngOnInit(): void {
  
        this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
        this.todoService.getBoards().then(boards => this.Boards = boards);
        this.todoService.getCurrentBoard().then(cBoard => this.currentBoard = cBoard).then( () => {
            this.cats = this.currentBoard.Categories;
        });
    }

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


