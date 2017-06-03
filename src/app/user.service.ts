import { Injectable } from '@angular/core';

@Injectable()
export class UserService {
	public currentUserId: number;

	setUser(userId: number){
		this.currentUserId = userId;
		console.log("Service current user SET: " + this.currentUserId);
	}

	getUser(): Promise<number> {
		var user: number;
		if (this.currentUserId != undefined){
			user = this.currentUserId;
			console.log("GET: getUser user value: " + user);
		}
		else {
			console.log("GET: Please Login!!");
			user = undefined;
		}
		return Promise.resolve(user);
	}
}