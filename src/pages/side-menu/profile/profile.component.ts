import { Component } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { SettingsPage } from '../../settings/settings';
import { UserService } from '../../../app/services/user.service';

@Component({
	selector: 'user-profile',
	templateUrl: 'profile.html'
})
export class ProfilePage {
	constructor(public userService: UserService, public modalCtrl: ModalController) {}

	openSettings() {
		let settingsModal = this.modalCtrl.create(SettingsPage);
		settingsModal.present();
	}
}
