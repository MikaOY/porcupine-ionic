import { Priority } from './priority';

export class Category {
    constructor(public Name: string, 
                public Color: number, // index in a Color array
                public DateCreated: Date,
                public DbId?: number, // optional to allow latency with DB
								public BoardId?: number, // ""
                public IsShown?: boolean,
                public Order?: number, 
                public DefaultPriority?: Priority,){}
}