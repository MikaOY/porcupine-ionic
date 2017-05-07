import { Injectable } from '@angular/core';

import { Todo } from './todo';
import { Category } from './Category';
import { Priority } from './Priority';

import { Connection, Request } from 'tedious';

const CATS: Category[] = [new Category('Life', 0, new Date(2017, 4, 30), undefined, undefined, true), 
                            new Category('Code', 1, new Date(2017, 3, 26), undefined, undefined, true),
                            new Category('Unsorted', null, null, null, null, true)];

// TODO: replace with DB info
const TODOS: Todo[] = [new Todo('Give an alpaca a hug', CATS[0], new Date(2017, 4, 30), false, undefined, Priority.Low),
                        new Todo('Finish Porcupine', CATS[1], new Date(2017, 4, 28), false, undefined, Priority.Medium),
                        new Todo('Make moist brownie', CATS[2], new Date(2017, 4, 29), true, new Date(2017, 4, 30), Priority.High)];

@Injectable()
export class TodoService {

    testReq(): void {

        var Connection = require('tedious').Connection;
        var Request = require('tedious').Request;


        // Create connection to database
        var config = {
            userName: 'MikaY', 
            password: 'Azure6377', 
            server: 'testing-mika.database.windows.net', 
            options: {
                database: 'porcupine-db'
            }
        }
        var connection = new Connection(config);

        // Attempt to connect and execute queries if connection goes through
        connection.on('connect', function(err) {
            if (err) {
                console.log(err)
            }
            else{
                queryDatabase()
            }
        });

        function queryDatabase(){
            console.log('Reading rows from porcupine-db...');

            // Read all rows from table
            var request = new Request(
                "SELECT * from todo",
                function(err, rowCount, rows) {
                    console.log(rowCount + ' row(s) returned');
                }
            );

            request.on('row', function(columns) {
                columns.forEach(function(column) {
                    console.log("%s\t%s", column.metadata.colName, column.value);
                });
            });

            connection.execSql(request);
        }
    }

    getTodos(): Promise<Todo[]> {
        this.testReq();
        return Promise.resolve(TODOS);
    }

    getCategories(): Promise<Category[]> {
        return Promise.resolve(CATS);
    }
}