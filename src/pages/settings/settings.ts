import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsService } from '../../app/settings.service';
import { UserService } from '../../app/user.service';
import { TodoService } from '../../app/todo.service';

@Component({
	selector: 'settings-page',
	templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {
  currentTheme: string;
  availableThemes: {className: string, displayName: string}[];
	currentUser: number;

  constructor(public navCtrl: NavController, 
							private settingsService: SettingsService,
							private userService: UserService,
							private todoService: TodoService) {}

	ngOnInit(){
		//this.userService.getUser().then(val => this.currentUser = val);
		this.settingsService.getTheme().subscribe(val => this.currentTheme = val);
    this.availableThemes = this.settingsService.availableThemes;
	}

  public setTheme(e) {
  	this.settingsService.setTheme(e);
		//console.log(this.currentUser);
	}

	restoreAll() {
		this.todoService.raiseTheDead();
	}
}
