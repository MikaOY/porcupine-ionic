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

	constructor(public navCtrl: NavController,
							public settingsService: SettingsService,
							public userService: UserService,
							public modalCtrl: ModalController,
							private todoService: TodoService) { }

	ngOnInit() {
		this.settingsService.getTheme().subscribe(val => this.currentTheme = val);
		this.availableThemes = this.settingsService.availableThemes;
	}

	public setTheme(e) {
		this.settingsService.setTheme(e);
	}

	restoreAll() {
		this.todoService.raiseTheDead();
	}
}
