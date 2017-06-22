import { DbCompatible } from './db-compatible.interface';

export class User implements DbCompatible {
	constructor(public DbId: number,
                public firstName: string,
								public lastName: string,
								public username: string,
								public email: string) { }
}