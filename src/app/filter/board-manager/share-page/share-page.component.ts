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
	viewOnly: boolean = true;
	note: string = "Check this out!";

	shareBoard() {
		//send to service
		var sBoard: Board = this.navParams.get("sBoard");
		if (this.shareEmails.length == 0){
			this.shareEmails.push("skanklyone@gmail.com");
		}
		console.log("sharing board:" + sBoard.Name + " with " + this.shareEmails.length + " people with note: " + this.note + " in viewonly mode: " + this.viewOnly);
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