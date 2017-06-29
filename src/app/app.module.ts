import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ElasticModule } from 'angular2-elastic';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { Http, RequestOptions } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';

import { MyApp } from './app.component';
import { CoreModule } from './services/core.module';
import { SharedModule } from './shared.module';
import { SettingsModule } from '../pages/settings/settings.module';
import { TodosModule } from '../pages/todos/todos.module';
import { SideMenuModule } from '../pages/side-menu/side-menu.module';
import { TabsModule } from '../pages/tabs/tabs.module';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
	return new AuthHttp(new AuthConfig(), http, options);
}

@NgModule({
	declarations: [MyApp],
	imports: [
		IonicModule.forRoot(MyApp, {}, { links: [] }),
		BrowserModule,
		FormsModule,
		HttpModule,
		ElasticModule,
		CoreModule,
		SharedModule,
		SettingsModule,
		TodosModule,
		SideMenuModule,
		TabsModule
	],
	bootstrap: [IonicApp],
	entryComponents: [MyApp],
	providers: [
		StatusBar,
		SplashScreen,
		{ provide: ErrorHandler, useClass: IonicErrorHandler },
		{ provide: AuthHttp, useFactory: authHttpServiceFactory, deps: [Http, RequestOptions] }
	]
})
export class AppModule { }