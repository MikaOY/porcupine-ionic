import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Board } from '../../../../app/classes/board';
import { Permission } from '../../../../app/classes/permission';
import { User } from '../../../../app/classes/user';
import { TodoService } from '../../../../app/services/todo.service';

@Component({
	templateUrl: 'share-page.html',
})

export class SharePage {
	sharees: Permission[] = [];
	note: string = 'Check this out!';
	containsEdit: boolean = false;
	containsViewOnly: boolean = false;
	isAddReciActive: boolean = false;
	newPerm: Permission = new Permission(new User(undefined, undefined, undefined, undefined, undefined), false);
	sBoard: Board = this.navParams.get('sBoard');

	constructor(public navParams: NavParams,
							public viewCtrl: ViewController,
							private alertCtrl: AlertController,
							public todoService: TodoService) { }

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
		this.viewCtrl.dismiss();
	}

	unshareBoard(perm: Permission) {
		this.todoService.unshareBoard(perm, this.sBoard);
	}

	addReciActive() {
		// toggles whether the adding sharees div is active
		this.isAddReciActive = !this.isAddReciActive;
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
}