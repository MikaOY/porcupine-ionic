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
	

  constructor(private authHttp: AuthHttp) {
    // If there is a profile saved in local storage
    this.local.get('profile').then(profile => {
      this.user = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    return tokenNotExpired();
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
    });    
  }

  public logout() {
    this.local.remove('profile');
    this.local.remove('id_token');
    this.local.remove('refresh_token');
    this.user = null;
  }
}