import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';
import { ModalController, NavParams } from 'ionic-angular';

import { Todo } from '../../../app/todo';
import { Category } from '../../../app/category';
import { Priority } from '../../../app/priority';
import { Board } from '../../../app/board';
import { UnlockPage } from '../../../app/lockable/unlock-page.component';

@Component({
	selector: 'todo-list',
	templateUrl: 'todo-list.html',
})

export class TodoList implements OnInit {
	private currentBoard: Board;
	private todos: Todo[];
	private cats: Category[];

	// this sets colors for the category numbers
	ColorArray: string[];

	selectedTodos: Todo[] = [];
	selectActive: boolean = false;
	priority: string[] = ["Low", "Medium", "High"];

	constructor(private todoService: TodoService, public params: NavParams, public ModalCtrl?: ModalController) { }

	// Leave service calls in init callback!
	ngOnInit(): void {
		setTimeout(() => {
			console.log('getting stuff for todolist');
			console.log('i love alpacas <3');
			this.todoService.getCategories().then(cats => this.cats = cats);
			this.todoService.getTodos().then(todos => this.todos = todos);
			this.todoService.getColors().then(colorArray => this.ColorArray = colorArray);
		}, 5000);
	}

	slothCurrentBoard(): Board {
		return this.todoService.slothGetCurrentBoard();
	}

	todoPriority(pri: number): Array<number> {
		let k = pri + 1;
		var priArray = Array(k).fill(2).map((x, i) => i);
		return priArray;
	}

	toggleDetail(todo) {
		todo.DetailShown = !todo.DetailShown;
	}

	deleteTodo(todo) {
		this.todoService.deleteTodo(todo.dbId);
		this.todos.splice(this.todos.indexOf(todo), 1);
	}

	activateEdit(todo) {
		todo.IsEditActive = !todo.IsEditActive;
	}

	onFormSubmit(todo) {
		todo.IsEditActive = false;
		this.todoService.updateTodo(todo);
	}

	itemChecked(IsDone, todo) { //run when you click the checkbox
		if (IsDone == true) {
			//function to find date and control archive
			var currentTime = new Date();
			todo.DateDone = currentTime;
		}
		else {
			todo.DateDone = undefined;
		}
	}

	//apparently working?
	changePrior(val: string, todo) {
		var pri: Priority = Priority[val];
		todo.Priority = pri;
	}

	reorderItems(indexes) {
		let element = this.currentBoard.Todos[indexes.from];
		this.currentBoard.Todos.splice(indexes.from, 1);
		this.currentBoard.Todos.splice(indexes.to, 0, element);
	}

	activateSelect(todo: Todo) {
		this.selectActive = true; //mode that controls ability to select/reorder todos

		if (todo.SelectActive === true) {
			todo.SelectActive = false;
		}
		else {
			todo.SelectActive = true;
			this.selectedTodos.push(todo);
		}
	}

	disableSelect() {
		this.selectActive = false;
		for (let todo of this.currentBoard.Todos) { //turns everything back to white color
			todo.SelectActive = false;
		}
		this.selectedTodos.length = 0; //empties selectedTodos array
	}

	UnlockTodo(todo) {
		let UnlockModal = this.ModalCtrl.create(UnlockPage); //pass in additional params here
		UnlockModal.onDidDismiss(data => {
			todo.IsLocked = data;
		})
		UnlockModal.present();
	}

	//adding a new todo
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
			this.newTodo.Info = "Kiss alpaca";
		}
		if (this.newTodo.Category == undefined) {
			this.newTodo.Category = this.cats ? this.cats[0] : undefined;
		}
		if (this.newTodo.Priority == undefined) {
			this.newTodo.Priority = Priority.Medium;
		}
		if (this.newTodo.DateDue == undefined) {
			this.newTodo.DateDue = new Date(2017, 1, 1);
		}
		console.log("todo-list new todo info:" + this.newTodo.Info);
		this.todoService.addTodo(this.newTodo).then(() => {
			this.todoService.getTodos().then(val => this.todos = val);
		});
		this.todos.push(this.newTodo);

		this.todoService.addTodo(this.newTodo);
		// reset form
		this.newTodo = new Todo("Kiss alpaca", this.cats ? this.cats[0] : undefined, undefined, false, undefined, false, Priority.Low, undefined);
		// DB id can be undefined because server generates auto 
	}
}