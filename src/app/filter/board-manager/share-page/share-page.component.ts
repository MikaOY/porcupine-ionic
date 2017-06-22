import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Board } from '../../../board';
import { Recipient } from '../../../recipient';
import { ViewController } from 'ionic-angular';

@Component({
	templateUrl: 'share-page.html',
})

export class SharePage {
	constructor(public navParams: NavParams,
		public viewCntrl: ViewController) { }

	sharees: Recipient[] = [];
	note: string = 'Check this out!';
	containsEdit: boolean = false;
	containsViewOnly: boolean = false;
	newReci: Recipient = new Recipient(undefined, false);

	shareBoard() {
		// TODO: send to service
		var sBoard: Board = this.navParams.get('sBoard');
		if (this.sharees.length == 0) {
			this.sharees.push(new Recipient('plump@piglet.com', true));
		}
		console.log('sharing board:' + sBoard.Name + ' with ' + this.sharees.length + ' people with note: ' + this.note);
		this.viewCntrl.dismiss();
	}

	addReci(reci: Recipient) {
		this.sharees.push(reci);
		if (this.containsEdit == false || this.containsViewOnly == false) {
			if (reci.ViewOnly == true) {
				this.containsViewOnly = true;
			}
			if (reci.ViewOnly == false) {
				this.containsEdit = true;
			}
		}
		this.newReci = new Recipient(undefined, false);
	}

	removeReci(reci: Recipient) {
		this.sharees.splice(this.sharees.indexOf(reci), 1);
		this.containsViewOnly = this.doesContainViewOnly();
	}

	private doesContainViewOnly(): boolean {
		for (let reci of this.sharees) {
			if (reci.ViewOnly == true) {
				return true;
			}
		}
		return false;
	}

	closeModal() {
		this.viewCntrl.dismiss();
	}
}