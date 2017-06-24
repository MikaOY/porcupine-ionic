import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';
import { ModalController, NavParams } from 'ionic-angular';

import { Todo } from '../../../app/todo';
import { Priority } from '../../../app/priority';
import { Board } from '../../../app/board';
import { UnlockPage } from '../../../app/lockable/unlock-page.component';

@Component({
	selector: 'todo-list',
	templateUrl: 'todo-list.html',
})

export class TodoList implements OnInit {
	justWait: boolean = false;

	ColorArray: string[];
	selectedTodos: Todo[] = [];
	selectActive: boolean = false;
	priority: string[] = ['Low', 'Medium', 'High'];

	constructor(private todoService: TodoService, 
							public params: NavParams, 
							public ModalCtrl?: ModalController) { }

	ngOnInit(): void {
		setTimeout(() => {
			this.justWait = true;
			this.todoService.getColors().then(colorArray => this.ColorArray = colorArray);
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
		todo.DetailShown = !todo.DetailShown;
	}

	deleteTodo(todo: Todo) {
		this.todoService.deleteObject(todo);
	}

	activateEdit(todo: Todo) {
		todo.IsEditActive = !todo.IsEditActive;
	}

	onFormSubmit(todo: Todo) {
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

	changePrior(val: string, todo: Todo) {
		todo.Priority = Priority[val];
	}

	reorderItems(indexes) {
		let element = this.slothCurrentBoard().Todos[indexes.from];
		this.slothCurrentBoard().Todos.splice(indexes.from, 1);
		this.slothCurrentBoard().Todos.splice(indexes.to, 0, element);
	}

	// mode that controls ability to select/reorder todos
	activateSelect(todo: Todo) {
		if (this.slothCurrentBoard().IsViewOnly != true){
			this.selectActive = true;

			if (todo.SelectActive === true) {
				todo.SelectActive = false;
			}
			else {
				todo.SelectActive = true;
				this.selectedTodos.push(todo);
			}
		}
	}

	disableSelect() {
		this.selectActive = false;
		for (let todo of this.slothCurrentBoard().Todos) { //turns everything back to white color
			todo.SelectActive = false;
		}
		this.selectedTodos.length = 0; //empties selectedTodos array
	}

	unlockBoard(board: Board) {
		let UnlockModal = this.ModalCtrl.create(UnlockPage); 
		UnlockModal.onDidDismiss(data => {
			board.IsLocked = data;
		});
		UnlockModal.present();
	}

	// adding a new todo
	addTodo: boolean = false;
	newTodo = new Todo(undefined, undefined, undefined, false, undefined, false, undefined, undefined, undefined, false, false, false);
	AddTodo() {
		this.addTodo = !this.addTodo;
	}

	onNewTodoFormSubmit() {
		this.addTodo = !this.addTodo;
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