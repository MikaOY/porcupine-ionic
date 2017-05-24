import { Category } from './category';
import { Priority } from './priority';
import { Lockable } from './lockable/lockable.interface';
import { ModalController } from 'ionic-angular';
import { LoginPage } from './login/login.component';

export class Todo implements Lockable{

    
    constructor(public Info: string,
                public Category: Category,
                public DateCreated: Date,
                public IsDone: boolean, 
                public DateDone: Date,
                public IsArchived: boolean,
                public Priority: Priority,
                public DateDue?: Date, 
                public DbId?: number, // optional to allow latency with DB
                public DetailShown?: boolean,
                public EditActive?: boolean,
                public SelectActive?: boolean,
                public ModalCtrl?: ModalController){ 
                }

    IsLocked: boolean = false;
    Lock(todo: Todo): true{
        console.log(todo.Info);
        todo.IsLocked = true;
        todo.DetailShown = false;
        return true;
    }
    Unlock(todo: Todo){
        console.log("Unlock!!");
        console.log(this.ModalCtrl);
        let UnlockModal = this.ModalCtrl.create(LoginPage); //pass in additional params here
        UnlockModal.present();
    }

    /*
    // toJSON is automatically used by JSON.stringify
    toJSON(): TodoJSON {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this, {
            // convert fields that need converting
            todo_info: this.Info,
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
            // Set categoryId, fill other fields later in instance scope
            var category = new Category(undefined, undefined, undefined, json.CategoryId);
        
            // copy all the fields from the json object
            Object.assign(todo, json, {
                // convert fields that need converting
                Info: json.todo_info,
                DateCreated: new Date(json.date_created),
                DateDone: new Date(json.date_done),
                Category: category,
            });

            return todo;
        }
    }

    // reviver can be passed as the second parameter to JSON.parse
    // to automatically call User.fromJSON on the resulting value.
    static reviver(key: string, value: any): any {
        return key === "" ? Todo.fromJSON(value) : value;
    }
    */
}
/*
export interface TodoJSON {
    todo_id: string;
    person_id: string;
    todo_info: string;
    category_id: number;
    priority_value: number;
    is_done: boolean;
    date_done: string;
    is_archived: boolean;
    date_created: string;
}
*/