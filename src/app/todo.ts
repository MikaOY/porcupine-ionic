import { Category } from './Category';
import { Priority } from './Priority';

export class Todo {
    constructor(public Info: string,
                public Category: Category,
                public DateCreated: Date, 
                public IsDone: boolean, 
                public DateDone: Date,
                public Priority: Priority,
                public DetailShown?: boolean,
                public EditActive?: boolean){

    }
}