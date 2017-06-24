import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ViewController, NavController } from 'ionic-angular';
import { Category } from '../../category';
import { Priority } from '../../priority';
import { Board } from '../../board';

@Component({
	templateUrl: 'add-category.html'
})

export class AddCategory implements OnInit{
	constructor(public viewCntrl: ViewController,
							private todoService: TodoService, 
							public navCntrl: NavController) {}

	ngOnInit(){
		this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
	}

	private ColorArray: string[];
	colorPicker: boolean = true;

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}
	
	priority = Priority;
	prior(): Array<string> {
		var keys = Object.keys(this.priority);
		return keys.slice(keys.length / 2);
	}

	presentColors() {
		this.colorPicker = !this.colorPicker;
	}

	setColor(color) {
		this.newCate.Color = this.ColorArray.indexOf(color);
		this.colorPicker = !this.colorPicker;
	}

	newCate = new Category('Love', undefined, undefined, undefined, 0, Priority.Low, true, false); 
	onNewCatFormSubmit() {
		// if board was not assigned, assign to first board 
		// TODO: change this to currentBoard
		if (this.newCate.BoardId == undefined){
			this.newCate.BoardId = this.slothBoards ? this.slothBoards[0].DbId : undefined;
		}
		// setting date created to current date
		var currentDate = new Date();
		this.newCate.DateCreated = currentDate;
		this.viewCntrl.dismiss(this.newCate);
		this.todoService.addCategory(this.newCate);
	}

	closeModal(){
		this.viewCntrl.dismiss();
	}
}