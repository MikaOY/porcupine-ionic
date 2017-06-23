import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/auth.service';
import { ViewController } from 'ionic-angular';

@Component({
	selector: 'user-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	constructor(public auth: AuthService) {}
}