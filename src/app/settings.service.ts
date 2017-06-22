import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { UserService } from './user.service';

@Injectable()
export class SettingsService {
	private theme: BehaviorSubject<string>;
	availableThemes: { className: string, displayName: string }[];
	passcode: string;

	constructor(public userService: UserService) {
		this.theme = new BehaviorSubject('null'); // theme default value
		this.availableThemes = [
			{ className: 'aqua-theme', displayName: 'Aqua' },
			{ className: 'red-theme', displayName: 'Red' },
			{ className: 'null', displayName: 'Default' }
		];
		this.passcode = "1234";
	}

	setTheme(val) {
		this.theme.next(val);
	}

	getTheme() {
		return this.theme.asObservable();
	}

	getPasscode(): Promise<string> {
		var user;
		this.userService.getUser().then(val => user = val);
		//TODO: fetch this user's passcode and return it
		return Promise.resolve(this.passcode);
	}
}