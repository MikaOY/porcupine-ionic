import { Component, OnInit } from '@angular/core';
import { NavParams, ViewController } from 'ionic-angular';

import { SettingsService } from '../../../../app/services/settings.service';
import { Todo } from '../../../../app/classes/todo';

@Component({
	templateUrl: 'unlock-page.html',
})

export class UnlockPage implements OnInit {
	passIn: string = ' ';
	userPasscode: string;
	todo: Todo;
	info: string;
	row1: number[] = [1, 2, 3];
	row2: number[] = [4, 5, 6];
	row3: number[] = [7, 8, 9];

	constructor(public settingsService: SettingsService,
							public params: NavParams,
							public viewCtrl: ViewController) {}

	ngOnInit() {
		this.settingsService.getPasscode().then(val => this.userPasscode = val);
	}

	passcodeSuccess() {
		// sets todo.Islocked = false;
		this.viewCtrl.dismiss(false);
	}

	back() {
		this.viewCtrl.dismiss(true);
	}

	add(num: number) {
		if (this.passIn == ' ') {
			this.passIn = String(num);
		}
		else {
			this.passIn = this.passIn + num;
		}

		// checks if passcode is right
		if (this.passIn.length == 4) {
			if (this.passIn == this.userPasscode) {
				this.passcodeSuccess();
			}
			else {
				this.passIn = ' ';
			}
		}
	}

	delete() {
		// deletes the last character in the box
		this.passIn = this.passIn.substr(0, this.passIn.length - 1);
	}
}