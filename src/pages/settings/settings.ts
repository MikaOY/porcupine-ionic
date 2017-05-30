import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SettingsService } from '../../app/settings.service';

@Component({
	selector: 'settings-page',
	templateUrl: 'settings.html'
})
export class SettingsPage implements OnInit {
  currentTheme: string;
  availableThemes: {className: string, displayName: string}[];

  constructor(public navCtrl: NavController, 
							private settingsService: SettingsService) {}

	ngOnInit(){
		this.settingsService.getTheme().subscribe(val => this.currentTheme = val);
    this.availableThemes = this.settingsService.availableThemes;
	}

  public setTheme(e) {
  	this.settingsService.setTheme(e);
	}
}
