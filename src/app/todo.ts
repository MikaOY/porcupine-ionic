import { Priority } from './Priority';

export class Todo {
    constructor(public DateCreated: Date, 
                public Done: boolean, 
                public DateDone: Date,
                public Priority: Priority){

    }
}