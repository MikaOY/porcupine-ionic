import { TodoService } from './todo.service';

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
                public DbId?: number, // optional to allow latency with DB
                private todoService?: TodoService,
                public DetailShown?: boolean,
                public EditActive?: boolean,
                public SelectActive?: boolean){ }

    // toJSON is automatically used by JSON.stringify
    toJSON(): TodoJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this, {
            // convert fields that need converting
            CategoryId: this.Category.DbId, 
            DateCreated: this.DateCreated.toString(),
            DateDone: this.DateDone.toString(),
        });
    }

    // fromJSON is used to convert an serialized version
    // of the User to an instance of the class
    static fromJSON(json: TodoJSON|string): Todo {
        if (typeof json === 'string') {
            // if it's a string, parse it first
            return JSON.parse(json, Todo.reviver);
        } else {
            // create an instance of the Todo class
            let todo = Object.create(Todo.prototype);
            // Get category based on id
            var category = todo.todoService.getCategories().then(cats => cats[json.CategoryId]);
        
            // copy all the fields from the json object
            Object.assign(todo, json, {
                // convert fields that need converting
                DateCreated: new Date(json.DateCreated),
                DateDone: new Date(json.DateDone),
                Category: category, 
            });
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any {
        return key === "" ? Todo.fromJSON(value) : value;
    }
}

export interface TodoJSON {
    Info: string;
    CategoryId: number;
    DateCreated: string;
    IsDone: boolean;
    DateDone: string;
    IsArchived: boolean;
    Priority: number;
    DbId?: number;
}