import { Component, OnInit } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserService } from './user.service';

import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from './login/login.component';
import { SettingsService } from './settings.service';


@Component({
	templateUrl: 'app.html',
	providers: [SettingsService]
})

export class MyApp implements OnInit {
	rootPage: any = TabsPage;
	chosenTheme: string;

	constructor(platform: Platform,
							statusBar: StatusBar,
							splashScreen: SplashScreen,
							public modalCtrl: ModalController,
							public userService: UserService,
							private settingsService: SettingsService,
							) {
		platform.ready().then((source) => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			if (source == 'cordova') {
				statusBar.styleDefault();
				splashScreen.hide();
			}
			
			// Present Lock on startup
			if (this.userService.authenticated() == false){
				this.userService.login();
			}
		});
	}

	ngOnInit(){
		this.settingsService.getTheme().subscribe(val => this.chosenTheme = val);
	}
}
