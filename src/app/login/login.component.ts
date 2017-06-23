import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { UserService } from '../user.service';


@Component({
	templateUrl: 'login.html'
})

export class LoginPage {
	LoginCredentials = { username: '', password: '' };
	
	constructor(public viewCtrl: ViewController,
							private userService: UserService) {
	}

	bananas() {
		this.viewCtrl.dismiss();
	}

	login() {
		this.viewCtrl.dismiss();
	}

	register() {
		console.log("Register clicked");
	}
}