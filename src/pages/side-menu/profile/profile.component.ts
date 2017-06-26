import { Component } from '@angular/core';

import { UserService } from '../../../app/services/user.service';

@Component({
	selector: 'user-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	constructor(public userService: UserService) {}
}