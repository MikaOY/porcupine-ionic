import { NgModule } from '@angular/core';

import { TodosPage } from './todos';
import { TodoList } from "./todo-list/todo-list.component";

@NgModule({
	imports: [ /*side-menu, shared, core*/ ],
	exports: [ TodosPage, TodoList ],
	declarations: [ TodosPage, TodoList ],
	providers: [],
})
export class TodosModule { }