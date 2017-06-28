import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ElasticModule } from 'angular2-elastic';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule }    from '@angular/http';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';

import { SettingsPage } from '../pages/settings/settings';
import { TodosPage } from '../pages/todos/todos';
import { TodoList } from '../pages/todos/todo-list/todo-list.component'; 

import { SideMenu } from '../pages/side-menu/side-menu.component';
import { AddCategory } from '../pages/side-menu/add-category/add-category.component';
import { BoardManager } from '../pages/side-menu/board-manager/board-manager.component';
import { SharePage } from '../pages/side-menu/board-manager/share-page/share-page.component';
import { UnlockPage } from '../pages/side-menu/board-manager/unlock-page/unlock-page.component';
import { ProfilePage } from '../pages/side-menu/profile/profile.component';

import { TodoService } from './services/todo.service';
import { SettingsService } from './services/settings.service';
import { UserService } from './services/user.service';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
  declarations: [
    MyApp,
    SettingsPage,
    TodosPage,
    TabsPage,
    TodoList,
    SideMenu,
    AddCategory,
    UnlockPage,
    BoardManager,
		SharePage,
		ProfilePage
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
    SideMenu,
    AddCategory,
    UnlockPage,
    BoardManager,
		SharePage,
		ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    TodoService,
    SettingsService,
		UserService,
		{
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ]
})
export class AppModule { }
