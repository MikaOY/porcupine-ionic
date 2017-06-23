import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/auth.service';
import { ViewController } from 'ionic-angular';

@Component({
	selector: 'profile-page',
	templateUrl: 'profile.html'
})
export class ProfilePage {

	constructor(public auth: AuthService,
							public viewCtrl: ViewController) {}

	isAuthenticated(): boolean {
		return this.auth.authenticated();
	}

	checkAuthenticated() {
		console.log("Check auth: " + this.auth.authenticated());
		console.log("Check 2 = " + this.isAuthenticated());
	}

	closeModal(){
		this.viewCtrl.dismiss();
	}
}