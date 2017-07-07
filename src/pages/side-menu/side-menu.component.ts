import { Component, OnInit } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { TodoService } from '../../app/services/todo.service';
import { Board } from '../../app/classes/board';
import { UserService } from '../../app/services/user.service';


@Component({
	selector: 'side-menu',
	templateUrl: 'side-menu.html'
})

export class SideMenu implements OnInit {

	constructor(private todoService: TodoService,
							public modalCtrl: ModalController,
							private userService: UserService) { }

	ngOnInit(): void { }
}
