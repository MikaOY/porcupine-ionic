import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

import { User } from '../classes/user';

//import * as bcrypt from '../../node_modules/bcrypt';

const auth0Config = {
  // needed for auth0
  clientID: 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d',

  // needed for auth0cordova
  clientId: 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d',
  domain: 'porcupine.au.auth0.com',
  callbackURL: location.href,
  packageIdentifier: 'YOUR_PACKAGE_ID'
};

declare var Auth0Lock: any;

@Injectable()
export class UserService {
	auth0 = new Auth0.WebAuth(auth0Config);
  accessToken: string;
  idToken: string;
  user: any;

	constructor(private http: Http, private authHttp: AuthHttp, public zone: NgZone) {
		// these two lines are from ionic2+, kEEP EM <3
		this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');

		/*OLD constrctor code*/
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
      if(err) {
        throw err;
      }

      this.setIdToken(authResult.idToken);
      this.setAccessToken(authResult.accessToken);

      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      this.setStorageVariable('expires_at', expiresAt);

      this.auth0.client.userInfo(this.accessToken, (err, profile) => {
        if(err) {
          throw err;
        }

        profile.user_metadata = profile.user_metadata || {};
        this.setStorageVariable('profile', profile);
        this.zone.run(() => {
          this.user = profile;
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

	/*OLD CODE STARS NOW*/
	private clientId: string = 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d'
	private auth0Domain: string = 'porcupine.au.auth0.com'
	private lock = new Auth0Lock(this.clientId, this.auth0Domain);	
	private userAuthO: Object;	
	private userDb: User;
	private jwtHelper: JwtHelper = new JwtHelper();
	private local: Storage = new Storage(localStorage);

	// TODO: make this unnecessary
	// isAuthenticated: boolean = false;
	refreshSubscription: any;

	// password hashing
	private saltRounds = 10;

	// TODO: migrate to constants file
	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	// private options = new RequestOptions({ headers: this.headers });

	// public login() {
	// 	// Show the Auth0 Lock widget
	// 	this.lock.show({
	// 		authParams: {
	// 			scope: 'openid offline_access',
	// 			device: 'Mobile device'
	// 		}
	// 	}, (err, profile, token, accessToken, state, refreshToken) => {
	// 		if (err) {
	// 			alert(err);
	// 		}
	// 		// If authentication is successful, save the items
	// 		// in local storage
	// 		this.local.set('profile', JSON.stringify(profile));
	// 		this.local.set('id_token', token);
	// 		this.local.set('refresh_token', refreshToken);
	// 		this.userAuthO = profile;
	// 		this.isAuthenticated = true;

	// 		console.log("User authenticated: " + this.isAuthenticated);

	// 		// TODO: get DB user, GET app data
	// 	});
	// }

	// public logout() {
	// 	this.local.remove('profile');
	// 	this.local.remove('id_token');
	// 	this.local.remove('refresh_token');
	// 	this.userAuthO = null;
	// }

	// public checkIfAuthenticated(): boolean {
	// 	// Check if there's an unexpired JWT
	// 	// return tokenNotExpired(); //TODO: tokenNotExpired fix
	// 	return this.isAuthenticated;
	// }

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