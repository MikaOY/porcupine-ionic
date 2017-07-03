import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from 'ionic-angular';

import { TodoService } from '../../../app/services/todo.service';
import { SettingsService } from '../../../app/services/settings.service';
import { Todo } from '../../../app/classes/todo';
import { Priority } from '../../../app/classes/priority';
import { Board } from '../../../app/classes/board';
import { UnlockPage } from '../../side-menu/board-manager/unlock-page/unlock-page.component';

@Component({
	selector: 'todo-list',
	templateUrl: 'todo-list.html',
})

export class TodoList implements OnInit {
	isReady: boolean = false;
	ColorArray: string[];
	selectedTodos: Todo[] = [];
	isSelectActive: boolean = false;
	priority: string[] = ['Low', 'Medium', 'High'];

	isAddTodoActive: boolean = false;
	newTodo = new Todo(undefined, undefined, undefined, false, undefined, false, undefined, undefined, undefined, false, false, false);

	constructor(private todoService: TodoService,
							public params: NavParams,
							public settingsService: SettingsService,
							public ModalCtrl?: ModalController) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.isReady = true;
			this.settingsService.getColors().then(colorArray => this.ColorArray = colorArray);
		}, 5000);
	}

	slothCurrentBoard(): Board {
		return this.todoService.slothGetCurrentBoard();
	}

	todoPriority(pri: number): Array<number> {
		var priArray = Array(pri + 1).fill(2).map((x, i) => i);
		return priArray;
	}

	toggleDetail(todo: Todo) {
		todo.IsDetailShown = !todo.IsDetailShown;
	}

	deleteTodo(todo: Todo) {
		this.todoService.deleteObject(todo);
	}

	activateEdit(todo: Todo) {
		todo.IsEditActive = !todo.IsEditActive;
	}

	onEditFormSubmit(todo: Todo) {
		todo.IsEditActive = false;
		this.todoService.updateTodo(todo);
	}

	itemChecked(IsDone: boolean, todo: Todo) {
		if (this.slothCurrentBoard().IsViewOnly != true) {
			if (IsDone == true) {
				// function to find date and control archive
				var currentTime = new Date();
				todo.DateDone = currentTime;
			}
			else {
				todo.DateDone = undefined;
			}
		}
		else {
			// TODO: if currentBoard is viewonly, don't check the box
		}
	}

	reorderItems(indexes) {
		let element = this.slothCurrentBoard().Todos[indexes.from];
		this.slothCurrentBoard().Todos.splice(indexes.from, 1);
		this.slothCurrentBoard().Todos.splice(indexes.to, 0, element);
	}

	// mode that controls ability to select/reorder todos
	activateSelect(todo: Todo) {
		if (this.slothCurrentBoard().IsViewOnly != true){
			this.isSelectActive = true;

			if (todo.IsSelectActive === true) {
				todo.IsSelectActive = false;
			}
			else {
				todo.IsSelectActive = true;
				this.selectedTodos.push(todo);
			}
		}
	}

	disableSelect() {
		this.isSelectActive = false;
		// turns everything back to white color
		for (let todo of this.slothCurrentBoard().Todos) {
			todo.IsSelectActive = false;
		}
		this.selectedTodos.length = 0;
	}

	unlockBoard(board: Board) {
		let UnlockModal = this.ModalCtrl.create(UnlockPage);
		UnlockModal.onDidDismiss(data => {
			board.IsLocked = data;
		});
		UnlockModal.present();
	}

	// adding a new todo
	addTodo() {
		this.isAddTodoActive = !this.isAddTodoActive;
	}

	onNewTodoFormSubmit() {
		this.isAddTodoActive = !this.isAddTodoActive;
		var currentDate = new Date();
		this.newTodo.DateCreated = currentDate;
		if (this.newTodo.Info == undefined || this.newTodo.Info == null) {
			this.newTodo.Info = 'Kiss alpaca';
		}
		if (this.newTodo.Category == undefined) {
			this.newTodo.Category = this.slothCurrentBoard().Categories[0];
		}
		if (this.newTodo.Priority == undefined) {
			this.newTodo.Priority = Priority.Medium;
		}
		if (this.newTodo.DateDue == undefined) {
			this.newTodo.DateDue = new Date(2017, 1, 1);
		}

		this.todoService.addTodo(this.newTodo);
		// reset form
		this.newTodo = new Todo("Kiss alpaca", this.slothCurrentBoard().Categories[0], undefined, false, undefined, false, Priority.Low, undefined);
		// DB id can be undefined because server generates auto
	}
}
