import { Component, OnInit } from '@angular/core';
import { Platform, ModalController, LoadingController, Loading } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TodoService } from './services/todo.service';
import { UserService } from './services/user.service';

import { TodosPage } from '../pages/todos/todos';
import { SettingsService } from './services/settings.service';

// Import Auth0Cordova
import Auth0Cordova from '@auth0/cordova';

@Component({
	templateUrl: 'app.html',
	providers: [SettingsService]
})

export class MyApp implements OnInit {
	title: string = 'Porcupine';

	rootPage: any = TodosPage;
	chosenTheme: string;

	constructor(platform: Platform,
		private statusBar: StatusBar,
		private splashScreen: SplashScreen,
		public modalCtrl: ModalController,
		public userService: UserService,
		public todoService: TodoService,
		private settingsService: SettingsService,
		public loadingCtrl: LoadingController) {
		platform.ready().then((source) => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			if (source == 'cordova') {
				statusBar.styleDefault();
				splashScreen.hide();
			}

			// Add this function
			(<any>window).handleOpenURL = (url) => {
				Auth0Cordova.onRedirectUri(url);
			};
		});

	}

	ngOnInit() {
		this.settingsService.getTheme().subscribe(val => this.chosenTheme = val);
		this.todoService.getCurrentBoard();
	}


}
