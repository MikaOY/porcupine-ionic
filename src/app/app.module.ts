import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { SettingsPage } from '../pages/settings/settings';
import { TodosPage } from '../pages/todos/todos';
import { TabsPage } from '../pages/tabs/tabs';


import { FilterPage, CategorySort, PropertySort } from './filter.component';


import { TodoList } from '../pages/todos/todo-list/todo-list.component'; 
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoService } from './todo.service';



@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    TodosPage,
    TabsPage,
    TodoList,
    FilterPage,
    CategorySort,
    PropertySort,
   
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingsPage,
    TodosPage,
    TabsPage,
    FilterPage,
    CategorySort,
    PropertySort,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    TodoService
  ]
})
export class AppModule {}
