import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ViewController, NavController } from 'ionic-angular';
import { Category } from '../../category';
import { Priority } from '../../priority';

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
		console.log(colorIndex);
		this.newCate.Color = colorIndex;
	}

	newCate = new Category(undefined, undefined, undefined);
	onNewCatFormSubmit() {
		this.viewCntrl.dismiss();
		var currentDate = new Date();
		this.newCate.DateCreated = currentDate;
		//code to take the newCate and add it to database
	}
}