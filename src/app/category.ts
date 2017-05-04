import { Priority } from './Priority';

export class Category {
    constructor(public Name: string, 
                public Color: number, // select from a limited array
                public DateCreated: Date, 
                public Order?: number, 
                public DefaultPriority?: Priority,
                public IsShown?: boolean){

    }
}


