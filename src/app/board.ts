import { Todo } from './todo';
import { Category } from './category';

export class Board {
	constructor(public Name: string,
							public Todos: Todo[],
							public Categories: Category[],
							public DateCreated: Date,
							public DbId: number){ }
}