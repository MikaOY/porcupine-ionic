import { User } from './user';

export class Permission {
	constructor(public User: User, public IsViewOnly: boolean) { }
}