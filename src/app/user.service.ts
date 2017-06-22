import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { User } from './user';

@Injectable()
export class UserService {

	public currentUserId: number;

	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	private id: number = 0;

	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http) { }

	setUser(userId: number) {
		this.currentUserId = userId;
		console.log("Service current user SET: " + this.currentUserId);
	}

	getUser(): Promise<number> {
		var user: number;
		if (this.currentUserId != undefined) {
			user = this.currentUserId;
			console.log("GET: getUser user value: " + user);
		}
		else {
			console.log("GET: Please Login!!");
			user = undefined;
		}
		return Promise.resolve(user);
	}

	getUserByEmail(email: string): Promise<User> {
		console.log('getting user by email');

		const url = `${this.apiUrl}/person?email=%27${email}%27`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('processing user by email');

			let user: User = this.processIntoUser(response);

			console.log('User by email retrieved!');
			return user;
		});
	}

	getUserById(id: number): Promise<User> {
		console.log('getting user by id');

		const url = `${this.apiUrl}/person?id=${id}`;
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
			user = new User(json['person_id'], json['fname'], json['lname'], json['username'], json['person_email']);
		}
		return user;
	}
}