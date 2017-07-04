import { Injectable, NgZone } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { User } from '../classes/user';
import { TodoService } from './todo.service';
import { Observable, Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';
import { environment } from '../../environments/environment';

import { Board } from '../classes/board';
import * as bcryptjs from 'bcryptjs';

const auth0Config = {
	// needed for auth0
	clientID: 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d',
	// needed for auth0cordova
	clientId: 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d',
	domain: 'porcupine.au.auth0.com',
	callbackURL: location.href,
	packageIdentifier: 'com.ionicframework.porcupineionic26189'
};

@Injectable()
export class UserService {
	private currentBoard: Board;
	private userDb: User;

	// password hashing
	private saltRounds = 10;

	// private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	// private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private authHttp: AuthHttp, public zone: NgZone) {
		// let bypassExpireTime = JSON.stringify((100000 * 1000) + new Date().getTime());
		// this.setStorageVariable('expires_at', bypassExpireTime);

		this.user = this.getStorageVariable('profile');
		this.idToken = this.getStorageVariable('id_token');

		// TODO: test only
		//this.setPassword('1234');
	}

	auth0 = new Auth0.WebAuth(auth0Config);
	accessToken: string;
	idToken: string;
	user: any;
	// sets authID if user is already logged in
	authId: string = this.getStorageVariable('profile') ? this.getStorageVariable('profile').identities[0].user_id : undefined;

	public getReqOptions(reqType: string): Promise<RequestOptions> {
		let hds;
		let ops: RequestOptions;
		if (this.accessToken == undefined) {
			console.log("getReqOptions: accessToken undefined, getting one");
			return this.GETAccessToken().then(val => {
				this.accessToken = val;
				console.log('Assigning req options');

				switch (reqType.toLowerCase()) {
					case 'get':
						hds = new Headers({ authorization: this.accessToken });
						break;
					default:
						hds = new Headers({ authorization: this.accessToken, 'Content-Type': 'application/x-www-form-urlencoded' });
						break;
				}
				ops = new RequestOptions({ headers: hds });
				return ops;
			});
		}
		else {
			console.log("getReqOptions: Accesstoken already have, returning " + this.accessToken);
			switch (reqType.toLowerCase()) {
				case 'get':
					hds = new Headers({ authorization: this.accessToken });
					break;
				default:
					hds = new Headers({ authorization: this.accessToken, 'Content-Type': 'application/x-www-form-urlencoded' });
					break;
			}
			ops = new RequestOptions({ headers: hds });
			return Promise.resolve(ops);
		}
	}

	private getStorageVariable(name) {
		return JSON.parse(window.localStorage.getItem(name));
	}

	private setStorageVariable(name, data) {
		window.localStorage.setItem(name, JSON.stringify(data));
	}

	private setIdToken(token) {
		this.idToken = token;
		this.setStorageVariable('id_token', token);
	}

	private setAccessToken(token) {
		this.accessToken = token;
		this.setStorageVariable('access_token', token);
	}

	public isAuthenticated() {
		const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
		return Date.now() < expiresAt;
	}

	public login() {
		const client = new Auth0Cordova(auth0Config);

		const options = {
			scope: 'openid profile offline_access'
		};

		client.authorize(options, (err, authResult) => {
			if (err) {
				throw err;
			}

			this.setIdToken(authResult.idToken);
			this.setAccessToken(authResult.accessToken);
			console.log('Login: access token = ' + authResult.accessToken);
			const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
			this.setStorageVariable('expires_at', expiresAt);

			this.auth0.client.userInfo(this.accessToken, (err, profile) => {
				if (err) {
					throw err;
				}
				profile.user_metadata = profile.user_metadata || {};
				this.setStorageVariable('profile', profile);
				this.zone.run(() => {
					this.user = profile;
					this.authId = profile.identities[0].user_id;
					console.log('authId set: ' + this.authId + ", getting currentBoard from login");
				});
			});
		});
	}

	public logout() {
		window.localStorage.removeItem('profile');
		window.localStorage.removeItem('access_token');
		window.localStorage.removeItem('id_token');
		window.localStorage.removeItem('expires_at');

		this.idToken = null;
		this.accessToken = null;
		this.user = null;
	}

	GETAccessToken(): Promise<string> {
		console.log('GETAccessToken: Getting user access token');

		// get access token for porcupine-api
		let hds = new Headers({ 'Content-Type': 'application/json' });
		let url = environment.tokenUrl;
		let body = environment.tokenReqBody;
		let ops = new RequestOptions({
			headers: hds,
		});

		return this.http.post(url, body, ops).toPromise().then((response) => {
			let json = response.json();
			console.log('GETAccessToken: Returning access token');
			console.log('GETAccessToken:' + json['token_type'] + ' ' + json['access_token']);
			return json['token_type'] + ' ' + json['access_token'];
		});
	}

	// dev authO id: 594c8b1cc3954a4865ef9bc9
	getUser(authOId?: string, forceGet?: boolean): Promise<User> {
		if (this.userDb == undefined || (forceGet != undefined && forceGet == true)) {
			if (authOId == undefined) {
				console.log('getUser: Returning null user user.service: authOId undefined!');
				return Promise.resolve(null);
			} else {
				return this.GETUserById(authOId).then((user) => {
					this.userDb = user;
					return user;
				});
			}
		} else {
			console.log('getUser: Returning userDb in user.service!');
			return Promise.resolve(this.userDb);
		}
	}

	GETUserById(id: string): Promise<User> {
		console.log('GETUserById: getting user by id');

		const url = `${environment.apiUrl}/user?authOId=${id}`;
		return this.getReqOptions('get').then(reqOps => {
			console.log('Actually requesting user by ID');
			console.log(url);
			return this.http.get(url, reqOps).toPromise().then((response: any) => {
				console.log('GETUserById: processing user by id');

				let user: User = this.processIntoUser(response.json());

				console.log('GETUserById: User by id retrieved!');
				return user;
			});
		});
	}

	GETUserByEmail(email: string): Promise<User> {
		console.log('getting user by email');

		const url = `${environment.apiUrl}/user?email=%27${email}%27`;
		return this.http.get(url, this.getReqOptions('get')).toPromise().then((response: any) => {
			console.log('processing user by email');

			let user: User = this.processIntoUser(response.json());

			console.log('User by email retrieved!');
			return user;
		});
	}

	processIntoUser(response: any) {
		let user: User;
		for (let json of response) {
			user = new User(json['person_id'], json['fname'], json['lname'], json['username'], json['person_email'], json['password_hash']);
		}
		return user;
	}

	// Password stuff

	setPassword(plainP: string) {
		if (bcryptjs != undefined) {
			let daHash;
			bcryptjs.hash(plainP, this.saltRounds, (err, hash) => {
				daHash = hash;
				console.log('Updating password!');

				const url = `${environment.apiUrl}/user`;
				if (this.userDb != undefined) {
					var details = {
						'fname': this.userDb.FirstName,
						'lname': this.userDb.LastName,
						'username': this.userDb.Username,
						'email': this.userDb.Email,
						'hash': hash,
					};
					let formBody = [];
					for (var property in details) {
						var encodedKey = encodeURIComponent(property);
						var encodedValue = encodeURIComponent(details[property]);
						formBody.push(encodedKey + '=' + '\'' + encodedValue + '\'');
					}
					let body = formBody.join('&');

					return this.http.put(url, body, this.getReqOptions('put')).toPromise().then((response: any) => {
						this.userDb.PasswordHash = daHash;
						console.log(this.userDb.PasswordHash);
						console.log('Update user response: ' + response.toString());
					}).catch(this.handleError);
				}
			});
		}
	}

	checkPassword(plainP?: string): boolean {
		if (bcryptjs != undefined) {
			// check cached password cache by default
			if (plainP == undefined) {
				plainP = this.userDb.PasswordHash;
			}
			let bool: boolean = false;
			bcryptjs.compare(plainP, this.userDb.PasswordHash, (err, res) => {
				bool = res;
			});
			return bool;
		}
	}

	private handleError(error: Response | any) {
		// In a real world app, you might use a remote logging infrastructure
		let errMsg: string;
		if (error instanceof Response) {
			const body = error.json() || '';
			const err = body.error || JSON.stringify(body);
			errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
		} else {
			errMsg = error.message ? error.message : error.toString();
		}
		console.error(errMsg);
		console.error('user.service: Something went wrong!');
		return Observable.throw(errMsg);
	}
}
