import { Component, OnInit } from '@angular/core';
import { UserService } from '../../app/user.service';
import { ViewController } from 'ionic-angular';

@Component({
	selector: 'user-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	constructor(public userService: UserService) {}
}