import { Priority } from './Priority';

export class Category {
    constructor(public Name: string, 
                public Color: string,
                public DateCreated: Date, 
                public Order?: number, 
                public DefaultPriority?: Priority){

    }
}