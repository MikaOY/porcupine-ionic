import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { User } from '../classes/user';
import { TodoService } from './todo.service';
import { Observable, Subscription } from 'rxjs';
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

//import * as bcrypt from '../../node_modules/bcrypt';

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
	private userDb: User;
	
	// password hashing
	private saltRounds = 10;

	// TODO: migrate to constants file
	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	// private options = new RequestOptions({ headers: this.headers });

	constructor(private http: Http, private authHttp: AuthHttp, public zone: NgZone, private todoService: TodoService) {
		// these two lines are from ionic2+, kEEP EM <3
		this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
		// TODO: password test 
		// this.setPassword('1234'); 
	}

  auth0 = new Auth0.WebAuth(auth0Config);
  accessToken: string;
  idToken: string;
  user: any;
	// sets authID if user is already logged in
	authId: string = this.getStorageVariable('profile') ? this.getStorageVariable('profile').identities[0].user_id : undefined;
  
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
					this.authId = profile.identities[0].user_id;
					console.log('authId set: ' + this.authId);
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

	// dev authO id: auth0|594c8b1cc3954a4865ef9bc9
	getUser(authOId?: string, forceGet?: boolean): Promise<User> {
		if (this.userDb == undefined || (forceGet != undefined && forceGet == true)) {
			if (authOId == undefined) {
				return Promise.resolve(null);
			} else {
				return this.GETUserById(authOId).then((user) => {
					this.userDb = user;
					return user;
				});
			}
		} else {
			return Promise.resolve(this.userDb);
		}
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

	GETUserById(id: string): Promise<User> {
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

	/* Password stuff (untested) */

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
}