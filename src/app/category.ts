import { Priority } from './priority';
import { DbCompatible } from './db-compatible.interface';

export class Category implements DbCompatible {
    constructor(public Name: string, 
                public Color: number, // index in a Color array
                public DateCreated: Date,
                public DbId: number, 
								public BoardId: number,
                public DefaultPriority?: Priority,
                public IsShown?: boolean,								
								public IsEditActive?: boolean){ }
}