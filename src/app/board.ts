import { Todo } from './todo';
import { Category } from './category';
import { Permission } from './permission';

import { DbCompatible } from './db-compatible.interface';
import { Lockable } from './lockable/lockable.interface';

export class Board implements Lockable, DbCompatible {
	constructor(public Name: string,
							public Todos: Todo[] = [],
							public Categories: Category[] = [],
							public DateCreated: Date,
							public DbId: number,
							public IsViewOnly?: boolean, // sharing
							public SharerId?: number, // sharing
							public OwnerId?: number, // sharing
							public Permissions?: Permission[], // sharing
							public IsEditActive?: boolean,
							public BoardActive?: boolean){}

		IsLocked: boolean = false;
    Lock(board: Board): true {
        board.IsLocked = true;
        return true;
		}
}