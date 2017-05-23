import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';


@Component ({
    templateUrl: 'login.html'
})

export class LoginPage {
    LoginCredentials = { username: '', password: '' };
    constructor(public viewCtrl: ViewController) {

    }  

    login(){
        // login to server
        this.viewCtrl.dismiss();
    }

    dismiss(){
        this.viewCtrl.dismiss();
    }
}