import { Component, OnInit } from '@angular/core';
import { ViewController, NavController } from 'ionic-angular';

import { TodoService } from '../../../app/services/todo.service';
import { SettingsService } from '../../../app/services/settings.service';
import { Category } from '../../../app/classes/category';
import { Priority } from '../../../app/classes/priority';
import { Board } from '../../../app/classes/board';

@Component({
	templateUrl: 'add-category.html'
})

export class AddCategory implements OnInit {
	priority = Priority;
	private ColorArray: string[];
	isColorPickerActive: boolean = false;
	newCate = new Category('Love', undefined, undefined, undefined, 0, Priority.Low, true, false);

	constructor(public viewCtrl: ViewController,
							private todoService: TodoService,
							public navCtrl: NavController,
							public settingsService: SettingsService) {}

	ngOnInit(){
		// retrieves colors for category options
		this.settingsService.getColors().then(ColorArray => this.ColorArray = ColorArray);
	}

	slothBoards(): Board[] {
		return this.todoService.slothGetBoards();
	}

	prior(): Array<string> {
		var keys = Object.keys(this.priority);
		return keys.slice(keys.length / 2);
	}

	presentColors() {
		this.isColorPickerActive = !this.isColorPickerActive;
	}

	setColor(color: string) {
		this.newCate.Color = this.ColorArray.indexOf(color);
		this.isColorPickerActive = !this.isColorPickerActive;
	}

	onNewCatFormSubmit() {
		// if board was not assigned, assign to first board
		// TODO: change this to currentBoard
		if (this.newCate.BoardId == undefined){
			this.newCate.BoardId = this.slothBoards ? this.slothBoards[0].DbId : undefined;
		}
		// setting date created to current date
		var currentDate = new Date();
		this.newCate.DateCreated = currentDate;
		this.viewCtrl.dismiss();
		this.todoService.addCategory(this.newCate);
	}
}
