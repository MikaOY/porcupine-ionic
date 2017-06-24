import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { User } from './user';

//import * as bcrypt from '../../node_modules/bcrypt';

declare var Auth0Lock: any;

@Injectable()
export class UserService {
	private clientId: string = 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d'
	private auth0Domain: string = 'porcupine.au.auth0.com'
	private lock = new Auth0Lock(this.clientId, this.auth0Domain);	
	private userAuthO: Object;	
	private userDb: User;
	private jwtHelper: JwtHelper = new JwtHelper();
	private local: Storage = new Storage(localStorage);

	// TODO: make this unnecessary
	isAuthenticated: boolean = false;
	refreshSubscription: any;

	// password hashing
	private saltRounds = 10;

	// TODO: migrate to constants file
	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	// private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private authHttp: AuthHttp) {
		// get local user profile
		this.local.get('profile').then(profile => {
			this.userAuthO = JSON.parse(profile);
		}).catch(error => {
			console.log(error);
		});

		// event handler for successful login
		this.lock.on("authenticated", authResult => {
			this.lock.getProfile(authResult.idToken, (error, profile) => {
				if (error) {
					alert(error);
					return;
				}

				this.local.set('id_token', authResult.idToken);
				this.local.set('profile', JSON.stringify(profile));
				this.userAuthO = profile;
				console.log('do this run');
			});
		});

		// this.setPassword('1234'); 
	}

	public login() {
		// Show the Auth0 Lock widget
		this.lock.show({
			authParams: {
				scope: 'openid offline_access',
				device: 'Mobile device'
			}
		}, (err, profile, token, accessToken, state, refreshToken) => {
			if (err) {
				alert(err);
			}
			// If authentication is successful, save the items
			// in local storage
			this.local.set('profile', JSON.stringify(profile));
			this.local.set('id_token', token);
			this.local.set('refresh_token', refreshToken);
			this.userAuthO = profile;
			this.isAuthenticated = true;

			console.log("User authenticated: " + this.isAuthenticated);

			// TODO: get DB user, GET app data
		});
	}

	public logout() {
		this.local.remove('profile');
		this.local.remove('id_token');
		this.local.remove('refresh_token');
		this.userAuthO = null;
	}

	public checkIfAuthenticated(): boolean {
		// Check if there's an unexpired JWT
		// return tokenNotExpired(); //TODO: tokenNotExpired fix
		return this.isAuthenticated;
	}

	getUser(authOId?: string, forceGet?: boolean): Promise<User> {
		if (this.userDb == undefined || (forceGet != undefined && forceGet == true)) {
			if (authOId == undefined) {
				Promise.reject('AuthO id not given to getUser method!');
			} else {
				return this.getUserById(authOId).then((user) => {
					this.userDb = user;
					return user;
				});
			}
		} else {
			return Promise.resolve(this.userDb);
		}
	}
	/*
	setPassword(plainP: string) {
		let daHash;
		bcrypt.hash(plainP, this.saltRounds, function (err, hash) {
			daHash = hash;
			console.log('Updating password!');

			const url = `${this.apiUrl}/user`;

			var details = {
				'fname': this.userDb.fname,
				'lname': this.userDb.lname,
				'username': this.userDb.username,
				'email': this.userDb.email,
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
				this.userDb.PasswordHash = daHash;
				console.log(this.userDb.PasswordHash);
				console.log('Update user response: ' + response.toString());
			}).catch(this.handleError);
		});
	}

	checkPassword(plainP: string): boolean {
		let bool: boolean = false;
		bcrypt.compare(plainP, this.userDb.PasswordHash, (err, res) => {
			bool = res;
		});
		return bool;
	}
	*/

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