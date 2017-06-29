import { NgModule } from '@angular/core';

import { TodosPage } from './todos';
import { TodoList } from "./todo-list/todo-list.component";
import { SideMenuModule } from "../side-menu/side-menu.module";
import { SharedModule } from "../../app/shared.module";
import { CoreModule } from "../../app/services/core.module";

@NgModule({
	imports: [ SideMenuModule, SharedModule, CoreModule ],
	exports: [ TodosPage, TodoList ],
	declarations: [ TodosPage, TodoList ],
	providers: [],
})
export class TodosModule { }