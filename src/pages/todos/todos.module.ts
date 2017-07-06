import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";

import { MyApp } from '../../app/app.component';
import { TodosPage } from './todos';
import { TodoList } from './todo-list/todo-list.component';
import { CatList } from './cat-list/cat-list.component';
import { EditCat } from './cat-list/edit-cat.component';
import { AddCategory } from './add-category/add-category.component';
import { SharePage } from './share-page/share-page.component';
import { EditBoard } from './edit-board/edit-board.component';

import { SideMenuModule } from '../side-menu/side-menu.module';
import { SharedModule } from '../../app/shared.module';
import { CoreModule } from '../../app/services/core.module';

@NgModule({
	imports: [IonicModule.forRoot(MyApp), SideMenuModule, SharedModule, CoreModule],
	exports: [TodosPage, TodoList],
	declarations: [TodosPage, TodoList, CatList, EditCat, AddCategory, SharePage, EditBoard],
	providers: [],
	entryComponents: [ TodosPage, EditCat, AddCategory, SharePage, EditBoard],
})
export class TodosModule { }
