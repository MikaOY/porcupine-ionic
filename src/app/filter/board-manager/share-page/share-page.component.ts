import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Board } from '../../../board';
import { ViewController } from 'ionic-angular';

@Component({
	templateUrl: 'share-page.html',
})

export class SharePage {
	constructor(public navParams: NavParams,
							public viewCntrl: ViewController) { }
	shareEmails: string[] = [];
	currentEmail: string;
	viewOnly: boolean;
	note: string;

	shareBoard() {
		//send to service
		var sBoard: Board = this.navParams.get('sBoard');
		console.log("sharing board:" + sBoard.Name + " with " + this.shareEmails.length);
		this.viewCntrl.dismiss();
	}

	addEmail(currentEmail){
		this.shareEmails.push(currentEmail);
		this.currentEmail = "";
	}

	removeEmail(email){
		this.shareEmails.splice(this.shareEmails.indexOf(email), 1);
	}

	closeModal(){
		this.viewCntrl.dismiss();
	}
}