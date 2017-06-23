import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Board } from '../../../board';
import { ViewController } from 'ionic-angular';

import { Permission } from '../../../permission';
import { User } from '../../../user';
import { TodoService } from '../../../todo.service';

@Component({
	templateUrl: 'share-page.html',
})

export class SharePage {
	constructor(public navParams: NavParams,
		public viewCntrl: ViewController,
		public todoService: TodoService) { }

	sharees: Permission[] = [];
	note: string = 'Check this out!';
	containsEdit: boolean = false;
	containsViewOnly: boolean = false;
	isAddReciActive: boolean = false;
	newPerm: Permission = new Permission(undefined, false);
	sBoard: Board = this.navParams.get("sBoard");

	getBoardPerms() {
		return this.todoService.slothGetBoardPerms(this.sBoard);
	}

	shareBoard() {
		this.todoService.shareBoard(this.sharees, this.sBoard, this.note);
		// TODO: remove default 
		if (this.sharees.length == 0) {
			this.sharees.push(new Permission(new User(undefined, undefined, undefined, undefined, 'plump@piglet.com'), true));
		}
		console.log('sharing board:' + this.sBoard.Name + ' with ' + this.sharees.length + ' people with note: ' + this.note);
		this.viewCntrl.dismiss();
	}

	unshareBoard(perm: Permission) {
		this.todoService.unshareBoard(perm, this.sBoard);
	}

	addReciActive() {
		this.isAddReciActive = !this.isAddReciActive;
	}

	addPerm(perm: Permission) {
		console.log("new reci name: " + perm.User.Email + " viewOnly: " + perm.IsViewOnly);
		this.sharees.push(perm);
		if (this.containsEdit == false || this.containsViewOnly == false) {
			if (perm.IsViewOnly == true) {
				this.containsViewOnly = true;
			}
			if (perm.IsViewOnly == false) {
				this.containsEdit = true;
			}
		}
		this.newPerm = new Permission(undefined, false);
	}

	removePerm(perm: Permission) {
		this.sharees.splice(this.sharees.indexOf(perm), 1); //remove from temp
		this.containsViewOnly = this.doesContainViewOnly();
	}

	private doesContainViewOnly(): boolean {
		for (let perm of this.sharees) {
			if (perm.IsViewOnly == true) {
				return true;
			}
		}
		return false;
	}

	closeModal() {
		this.viewCntrl.dismiss();
	}
}