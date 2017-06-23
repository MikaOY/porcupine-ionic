import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsService } from '../../app/settings.service';
import { UserService } from '../../app/user.service';
import { ProfilePage } from '../profile/profile.component';
import { ModalController } from 'ionic-angular';
import { TodoService } from '../../app/todo.service';

@Component({
	selector: 'settings-page',
	templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {
	currentTheme: string;
	availableThemes: { className: string, displayName: string }[];
	currentUser: number;

	constructor(public navCtrl: NavController,
		public settingsService: SettingsService,
		public userService: UserService,
		public modalCtrl: ModalController,
		private todoService: TodoService) { }

	ngOnInit() {
		//this.userService.getUser().then(val => this.currentUser = val);
		this.settingsService.getTheme().subscribe(val => this.currentTheme = val);
		this.availableThemes = this.settingsService.availableThemes;
	}

	public setTheme(e) {
		this.settingsService.setTheme(e);
		//console.log(this.currentUser);
	}

	openProfile() {
		let profile = this.modalCtrl.create(ProfilePage);
		profile.present();
	}

	restoreAll() {
		this.todoService.raiseTheDead();
	}
}
