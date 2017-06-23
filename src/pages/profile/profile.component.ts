import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../app/auth.service';

@Component({
	selector: 'profile-page',
	templateUrl: 'profile.html'
})
export class ProfilePage {

	constructor(private auth: AuthService) {}
}