import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { AuthHttp, JwtHelper, tokenNotExpired } from 'angular2-jwt';
import { User } from './user';

declare var Auth0Lock: any;

import * as bcrypt from '../../node_modules/bcrypt';

@Injectable()
export class UserService {
	clientId: string = 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d'
	auth0Domain: string = 'porcupine.au.auth0.com'
  jwtHelper: JwtHelper = new JwtHelper();
  lock = new Auth0Lock(this.clientId, this.auth0Domain);
  local: Storage = new Storage(localStorage);
  user: Object;

	//TODO: make this unnecessary
	isAuthenticated: boolean = false;
	refreshSubscription: any;

	private currentUser: User;
        
	private apiUrl: string = 'http://porcupine-dope-api.azurewebsites.net';
	private headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
	// private options = new RequestOptions({ headers: this.headers });

	// password hashing
	private saltRounds = 10;
	constructor(private http: Http,
							private authHttp: AuthHttp) { 
		this.local.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });

		this.lock.on("authenticated", authResult => {
      this.lock.getProfile(authResult.idToken, (error, profile) => {
        if (error) {
          alert(error);
          return;
        }

        this.local.set('id_token', authResult.idToken);
        this.local.set('profile', JSON.stringify(profile));
        this.user = profile;
				console.log('do this run');
      });
    });
		this.setPassword('1234'); 
	}

	public authenticated(): boolean {
    // Check if there's an unexpired JWT
    //return tokenNotExpired(); //TODO: tokenNotExpired fix
		return this.isAuthenticated;
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
      this.user = profile;
			this.isAuthenticated = true;
			console.log("It logged in???");
			console.log("is authenticated: " + this.isAuthenticated);
    });    
  }

  public logout() {
    this.local.remove('profile');
    this.local.remove('id_token');
    this.local.remove('refresh_token');
    this.user = null;
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