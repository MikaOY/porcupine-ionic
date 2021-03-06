import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";

import { MyApp } from "../../app/app.component";
import { TodosPage } from './todos';
import { TodoList } from "./todo-list/todo-list.component";
import { SideMenuModule } from "../side-menu/side-menu.module";
import { SharedModule } from "../../app/shared.module";
import { CoreModule } from "../../app/services/core.module";

@NgModule({
	imports: [IonicModule.forRoot(MyApp), SideMenuModule, SharedModule, CoreModule],
	exports: [TodosPage, TodoList],
	declarations: [TodosPage, TodoList],
	providers: [],
	entryComponents: [ TodosPage ],
})
export class TodosModule { }