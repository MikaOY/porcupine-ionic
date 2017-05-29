import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ElasticModule } from 'angular2-elastic';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from './login/login.component';
import { SettingsPage } from '../pages/settings/settings';
import { TodosPage } from '../pages/todos/todos';
import { TabsPage } from '../pages/tabs/tabs';
import { UnlockPage } from './lockable/unlock-page.component';

import { CategorySort, PropertySort } from './filter/filter.component';
import { CategoryManager } from './filter/cat-manager/cat-manager.component';
import { AddCategory } from './filter/cat-manager/add-category.component';
import { BoardManager } from './filter/board-manager/board-manager.component';
import { TodoList } from '../pages/todos/todo-list/todo-list.component'; 
import { SharePage } from '../pages/todos/todo-list/share-page/share-page.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoService } from './todo.service';
import { SettingsService } from './settings.service';
import { HttpModule }    from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    TodosPage,
    TabsPage,
    TodoList,
    CategorySort,
    PropertySort,
    CategoryManager,
    AddCategory,
    LoginPage,
    UnlockPage,
    BoardManager
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    HttpModule,
    ElasticModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    TodosPage,
    TabsPage,
    CategorySort,
    PropertySort,
    CategoryManager,
    AddCategory,
    LoginPage,
    UnlockPage,
    BoardManager
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoService,
    SettingsService
  ]
})
export class AppModule { }
