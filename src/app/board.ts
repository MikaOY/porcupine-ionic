import { Todo } from './todo';
import { Category } from './category';
import { DbCompatible } from './db-compatible.interface';

export class Board implements DbCompatible {
	constructor(public Name: string,
							public Todos: Todo[] = [],
							public Categories: Category[] = [],
							public DateCreated: Date,
							public DbId: number,
							public IsViewOnly?: boolean, // sharing
							public SharerId?: number, // sharing
							public OwnerId?: number, // sharing
							public IsEditActive?: boolean,
							public BoardActive?: boolean){}
}