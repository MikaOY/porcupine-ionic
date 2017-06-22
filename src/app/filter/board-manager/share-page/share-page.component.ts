import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Board } from '../../../board';
import { Recipient } from '../../../recipient';
import { ViewController } from 'ionic-angular';
import { TodoService } from '../../../todo.service';

@Component({
	templateUrl: 'share-page.html',
})

export class SharePage {
	constructor(public navParams: NavParams,
							public viewCntrl: ViewController,
							public todoService: TodoService) { }

	sharees: Recipient[] = [];
	note: string = 'Check this out!';
	containsEdit: boolean = false;
	containsViewOnly: boolean = false;
	isAddReciActive: boolean = false;
	newReci: Recipient = new Recipient(undefined, false);
	sBoard: Board = this.navParams.get("sBoard");

	sharedWithBoards(): Recipient[]{
		//return this.todoService.getSharedWithReci(this.sBoard);
		return 
	}
	shareBoard() {
		this.todoService.shareBoard(this.sharees, this.sBoard, this.note);
		
		if (this.sharees.length == 0) {
			this.sharees.push(new Recipient('plump@piglet.com', true));
		}
		console.log('sharing board:' + this.sBoard.Name + ' with ' + this.sharees.length + ' people with note: ' + this.note);
		this.viewCntrl.dismiss();
	}

	addReciActive(){
		this.isAddReciActive = !this.isAddReciActive;
	}

	addReci(reci: Recipient) {
		console.log("new reci name: " + reci.Email + " viewOnly: " + reci.IsViewOnly);
		this.sharees.push(reci);
		if (this.containsEdit == false || this.containsViewOnly == false) {
			if (reci.IsViewOnly == true) {
				this.containsViewOnly = true;
			}
			if (reci.IsViewOnly == false) {
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
			if (reci.IsViewOnly == true) {
				return true;
			}
		}
		return false;
	}

	closeModal() {
		this.viewCntrl.dismiss();
	}
}