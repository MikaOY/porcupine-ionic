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
		this.todoService.getBoards().then(val => this.boards = val);
	}

	private ColorArray: string[];
	private boards: Board[];
	colorPicker: boolean = true;

	priority = Priority;
	prior(): Array<string> {
		var keys = Object.keys(this.priority);
		return keys.slice(keys.length / 2);
	}

	presentColors() {
		this.colorPicker = !this.colorPicker;
		console.log("color picker is" + this.colorPicker);
	}

	setColor(color) {
		var colorIndex = this.ColorArray.indexOf(color);
		this.newCate.Color = colorIndex;
		this.colorPicker = !this.colorPicker;
	}

	newCate = new Category(undefined, undefined, undefined);
	onNewCatFormSubmit() {
		var currentDate = new Date();
		this.newCate.DateCreated = currentDate;
		this.newCate.BoardId = 0; // change later
		console.log("onNewCatForm Clicked");
		//code to take the newCate and add it to database
		this.viewCntrl.dismiss(this.newCate);
		this.todoService.addCategory(this.newCate);
		
	}

	closeModal(){
		this.viewCntrl.dismiss();
	}
}