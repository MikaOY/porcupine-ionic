import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../../app/todo.service';
import { ModalController, NavParams } from 'ionic-angular';

import { Todo } from '../../../app/todo';
import { Category } from '../../../app/category';
import { Priority } from '../../../app/priority';
import { Board } from '../../../app/board';
import { UnlockPage } from '../../../app/lockable/unlock-page.component';
import { SharePage } from './share-page/share-page.component';

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
    this.todoService.getCurrentBoard().subscribe(board => this.currentBoard = board as Board);			
		this.todoService.getCategories().then(cats => this.cats = cats);
		//this.todoService.getTodos().then(todos => this.todos = todos);
		this.todoService.getColors().then(colorArray => this.ColorArray = colorArray);
		this.todoService.tempGetTodos().then(todos => this.todos = todos);
  }

	todoPriority(pri: number): Array<number> {
		let k = pri + 1;
		var priArray = Array(k).fill(2).map((x, i) => i);
		return priArray;
	}

	toggleDetail(todo) {
		todo.DetailShown = !todo.DetailShown;
	}

	deleteTodo(dbId){
		this.todoService.deleteTodo(dbId);//remove from view too
	}

	activateEdit(todo) {
		todo.EditActive = !todo.EditActive;
	}

	onFormSubmit(todo) {
		todo.EditActive = false;
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

	shareTodo(todo){
		console.log("share clicked");
		let shareModal = this.ModalCtrl.create(SharePage, {sTodo: todo});
		shareModal.present();
	}

	//adding a new todo
	addTodo: boolean = false;
	newTodo = new Todo(undefined, undefined, undefined, undefined, undefined, false, undefined);
	AddTodo() {
		this.addTodo = !this.addTodo;
	}

	onNewTodoFormSubmit() {
		this.addTodo = !this.addTodo;
		var currentDate = new Date();
		this.newTodo.DateCreated = currentDate;
		console.log("todo-list new todo info:" + this.newTodo.Info);
		this.todoService.addTodo(this.newTodo);
		//TODO: pass newTodo to server and add to user's array 
	}
}