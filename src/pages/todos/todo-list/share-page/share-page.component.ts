import { Component } from '@angular/core';
import { NavParams, ModalController } from 'ionic-angular';
import { Todo } from '../../../../app/todo';

@Component ({
	templateUrl: 'share-page.html',
})

export class SharePage{
	constructor (public navParams: NavParams){}
	shareUsername: string;
	shareTodo(){
		//send 
		var sTodo: Todo = this.navParams.get('sTodo');
		console.log(sTodo.Info);
	}
}