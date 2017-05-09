import { Category } from './category';
import { Priority } from './priority';

export class Todo {
    constructor(public Info: string,
                public Category: Category,
                public DateCreated: Date, 
                public IsDone: boolean, 
                public DateDone: Date,
                public IsArchived: boolean,
                public Priority: Priority,
                public DetailShown?: boolean,
                public EditActive?: boolean){
    }
}