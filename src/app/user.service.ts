import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';

import { User } from './user';

import * as bcrypt from '../../node_modules/bcrypt';

@Injectable()
export class UserService {

	private currentUser: User;
        
	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	// private options = new RequestOptions({ headers: this.headers });

	// password hashing
	private saltRounds = 10;

	constructor(private http: Http) {
		this.setPassword('1234'); 
	}

	getUser(authOId?: string, forceGet?: boolean): Promise<User> {
		if (this.currentUser == undefined || (forceGet != undefined && forceGet == true)) {
			if (authOId == undefined) {
				Promise.reject('AuthO id not given to getUser method!');
			} else {
				return this.getUserById(authOId).then((user) => {
					this.currentUser = user;
					return user;
				});
			}
		} else {
			return Promise.resolve(this.currentUser);
		}
	}

	setPassword(plainP: string) {
		let daHash;
		bcrypt.hash(plainP, this.saltRounds, function (err, hash) {
			daHash = hash;
			console.log('Updating password!');

			const url = `${this.apiUrl}/user`;

			var details = {
				'fname': this.currentUser.fname,
				'lname': this.currentUser.lname,
				'username': this.currentUser.username,
				'email': this.currentUser.email,
				'hash': hash,
			};
			let formBody = [];
			for (var property in details) {
				var encodedKey = encodeURIComponent(property);
				var encodedValue = encodeURIComponent(details[property]);
				formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
			}
			let body = formBody.join('&');

			return this.http.put(url, body, this.options).toPromise().then((response: any) => {
				this.currentUser.PasswordHash = daHash;
				console.log(this.currentUser.PasswordHash);
				console.log('Update user response: ' + response.toString());
			}).catch(this.handleError);
		});
	}

	checkPassword(plainP: string): boolean {
		let bool: boolean = false;
		bcrypt.compare(plainP, this.currentUser.PasswordHash, (err, res) => {
			bool = res;
		});
		return bool;
	}

	getUserByEmail(email: string): Promise<User> {
		console.log('getting user by email');

		const url = `${this.apiUrl}/user?email=%27${email}%27`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('processing user by email');

			let user: User = this.processIntoUser(response);

			console.log('User by email retrieved!');
			return user;
		});
	}

	getUserById(id: string): Promise<User> {
		console.log('getting user by id');

		const url = `${this.apiUrl}/user?authOId=${id}`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('processing user by id');

			let user: User = this.processIntoUser(response);

			console.log('User by id retrieved!');
			return user;
		});
	}

	private processIntoUser(response: any) {
		let user: User;
		for (let json of response.json()) {
			user = new User(json['person_id'], json['fname'], json['lname'], json['username'], json['person_email'], json['password_hash']);
		}
		return user;
	}
}