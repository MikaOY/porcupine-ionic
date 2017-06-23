import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { Board } from '../../../board';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Permission } from '../../../permission';
import { User } from '../../../user';
import { TodoService } from '../../../todo.service';

@Component({
	templateUrl: 'share-page.html',
})

export class SharePage {
	constructor(public navParams: NavParams,
		public viewCntrl: ViewController,
		private alertCtrl: AlertController,
		public todoService: TodoService) { }

	sharees: Permission[] = [];
	note: string = 'Check this out!';
	containsEdit: boolean = false;
	containsViewOnly: boolean = false;
	isAddReciActive: boolean = false;
	newPerm: Permission = new Permission(new User(undefined, undefined, undefined, undefined, undefined), false);
	sBoard: Board = this.navParams.get("sBoard");

	getBoardPerms() {
		return this.todoService.slothGetBoardPerms(this.sBoard);
	}

	shareBoard() {
		if (this.sharees.length == 0) {
			// alert the user of his/her mistake
			let alert = this.alertCtrl.create({
				title: 'Empty email',
				subTitle: 'Mr. Nobody doesn\'t accept shares. Provide an email!',
				buttons: ['Fine']
			});
			alert.present();
		} else {
			console.log('sharing board:' + this.sBoard.Name + ' with ' + this.sharees.length + ' people with note: ' + this.note);
			this.todoService.shareBoard(this.sharees, this.sBoard, this.note);
		}

		this.viewCntrl.dismiss();
	}

	unshareBoard(perm: Permission) {
		this.todoService.unshareBoard(perm, this.sBoard);
	}

	addReciActive() {
		this.isAddReciActive = !this.isAddReciActive;
		console.log("isAddReciActive? " + this.isAddReciActive);
	}

	addPerm(perm: Permission) {
		// only share if email doesn't exist in sharee list AND perms list
		if (this.sharees.find((sPerm, index, sArray) => perm.User.Email == sPerm.User.Email) == undefined) {
			if (this.sBoard.Permissions.find((sPerm, index, sArray) => perm.User.Email == sPerm.User.Email) == undefined) {
				this.sharees.push(perm);
				if (this.containsEdit == false || this.containsViewOnly == false) {
					if (perm.IsViewOnly == true) {
						this.containsViewOnly = true;
					}
					if (perm.IsViewOnly == false) {
						this.containsEdit = true;
					}
				}
				this.newPerm = new Permission(new User(undefined, undefined, undefined, undefined, undefined), false);
			} else {
				// alert the user of his/her mistake
				let alert = this.alertCtrl.create({
					title: 'Are you demented?',
					subTitle: 'You already shared this board with this user!',
					buttons: ['My bad!']
				});
				alert.present();
			}
		} else {
			// alert the user of his/her mistake
			let alert = this.alertCtrl.create({
				title: 'Are you blind?',
				subTitle: 'This user has already been added to the share list!',
				buttons: ['Oops']
			});
			alert.present();
		}
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