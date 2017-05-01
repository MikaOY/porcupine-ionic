import { Category } from './Category';
import { Priority } from './Priority';

export class Todo {
    constructor(public Category: Category,
                public DateCreated: Date, 
                public Done: boolean, 
                public DateDone: Date,
                public Priority: Priority){

    }
}