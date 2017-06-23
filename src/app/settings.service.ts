import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import { UserService } from './user.service';

@Injectable()
export class SettingsService {
	private theme: BehaviorSubject<string>;
	availableThemes: { className: string, displayName: string }[];

	constructor(public userService: UserService) {
		this.theme = new BehaviorSubject('null'); // theme default value
		this.availableThemes = [
			{ className: 'aqua-theme', displayName: 'Aqua' },
			{ className: 'red-theme', displayName: 'Red' },
			{ className: 'null', displayName: 'Default' }
		];
	}

	setTheme(val) {
		this.theme.next(val);
	}

	getTheme() {
		return this.theme.asObservable();
	}

	getPasscode(): Promise<string> {
		// method below assumes user data already retreived at login
		return this.userService.getUser().then((user) => {
			return user.PasswordHash;
		});
	}
}