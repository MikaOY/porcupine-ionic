import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper } from 'angular2-jwt';
import { Observable, Subscription } from 'rxjs';

import Auth0Cordova from '@auth0/cordova';
import Auth0 from 'auth0-js';

import { User } from '../classes/user';

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

	public currentUserId: number;
	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';

	constructor(private http: Http,
							private authHttp: AuthHttp,
							public zone: NgZone) { 
		this.user = this.getStorageVariable('profile');
    this.idToken = this.getStorageVariable('id_token');
	}

  auth0 = new Auth0.WebAuth(auth0Config);
  accessToken: string;
  idToken: string;
  user: any;

  
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
/*USER.SERVICE functions*/
	getUser(): Promise<number> { //TODO: should get currentUser
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

		const url = `${this.apiUrl}/user?email=%27${email}%27`;
		return this.http.get(url).toPromise().then((response: any) => {
			console.log('processing user by email');

			let user: User = this.processIntoUser(response);

			console.log('User by email retrieved!');
			return user;
		});
	}

	getUserById(id: number): Promise<User> {
		console.log('getting user by id');

		const url = `${this.apiUrl}/user?id=${id}`;
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