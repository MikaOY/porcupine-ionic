import { Todo } from './todo';
import { Category } from './category';
import { Permission } from './permission';

import { DbCompatible } from '../interfaces/db-compatible.interface';
import { Lockable } from '../interfaces/lockable.interface';

export class Board implements Lockable, DbCompatible {
	constructor(public Name: string,
							public Todos: Todo[] = [],
							public Categories: Category[] = [],
							public DateCreated: Date,
							public DbId: number,
							public IsViewOnly = false, // sharing
							public SharerId?: number, // sharing
							public OwnerId?: number, // sharing
							public Permissions?: Permission[], // sharing
							public IsEditActive?: boolean,
							public IsBoardActive?: boolean){} // TODO: figure out why this exists

		IsLocked: boolean = false;
    Lock(board: Board): true {
        board.IsLocked = true;
        return true;
		}
}
