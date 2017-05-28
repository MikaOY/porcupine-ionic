import { Component } from '@angular/core';
import { Platform, ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';
import { TodoService } from './todo.service';
import { LoginPage } from './login/login.component';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, modalCtrl: ModalController, todoService: TodoService) {
    platform.ready().then((source) => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      if (source == 'cordova') {
        statusBar.styleDefault();
      }

      // Get server data

      splashScreen.hide();
      let loginModal = modalCtrl.create(LoginPage);
      loginModal.present();
    });
  }
}