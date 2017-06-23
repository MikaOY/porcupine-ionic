// app/services/auth/auth.ts

import { Storage } from '@ionic/storage';
import {AuthHttp, JwtHelper, tokenNotExpired} from 'angular2-jwt';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {
	clientId: string = 'pBum20Ve6T5n76t05t6tue5G2MMk9I3d'
	auth0Domain: string = 'porcupine.au.auth0.com'
  jwtHelper: JwtHelper = new JwtHelper();
  lock = new Auth0Lock(this.clientId, this.auth0Domain);
  local: Storage = new Storage(localStorage);
  user: Object;

	//TODO: make this unnecessary
	isAuthenticated: boolean = false;

	refreshSubscription: any;

  constructor(private authHttp: AuthHttp) {
    // If there is a profile saved in local storage
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
			//this.scheduleRefresh(); //refresh token
    });    
  }

  public logout() {
    this.local.remove('profile');
    this.local.remove('id_token');
    this.local.remove('refresh_token');
    this.user = null;
		this.unscheduleRefresh(); //refresh token
  }

	//refreshing token functions
	public scheduleRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    let source = this.authHttp.tokenStream.flatMap(
      token => {
        // The delay to generate in this case is the difference
        // between the expiry time and the issued at time
        let jwtIat = this.jwtHelper.decodeToken(token).iat;
        let jwtExp = this.jwtHelper.decodeToken(token).exp;
        let iat = new Date(0);
        let exp = new Date(0);

        let delay = (exp.setUTCSeconds(jwtExp) - iat.setUTCSeconds(jwtIat));

        return Observable.interval(delay);
      });

    this.refreshSubscription = source.subscribe(() => {
      this.getNewJwt();
    });
  }

  public startupTokenRefresh() {
    // If the user is authenticated, use the token stream
    // provided by angular2-jwt and flatMap the token
    if (this.authenticated()) {
      let source = this.authHttp.tokenStream.flatMap(
        token => {
          // Get the expiry time to generate
          // a delay in milliseconds
          let now: number = new Date().valueOf();
          let jwtExp: number = this.jwtHelper.decodeToken(token).exp;
          let exp: Date = new Date(0);
          exp.setUTCSeconds(jwtExp);
          let delay: number = exp.valueOf() - now;

          // Use the delay in a timer to
          // run the refresh at the proper time
          return Observable.timer(delay);
        });

       // Once the delay time from above is
       // reached, get a new JWT and schedule
       // additional refreshes
       source.subscribe(() => {
         this.getNewJwt();
         this.scheduleRefresh();
       });
    }
  }

  public unscheduleRefresh() {
    // Unsubscribe fromt the refresh
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  public getNewJwt() {
    // Get a new JWT from Auth0 using the refresh token saved
    // in local storage
    this.local.get('refresh_token').then(token => {
      this.lock.getClient().refreshToken(token, (err, delegationRequest) => {
        if (err) {
          alert(err);
        }
        this.local.set('id_token', delegationRequest.id_token);
      });
    }).catch(error => {
      console.log(error);
    });
  }
}