import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../todo.service';
import { ViewController, NavController } from 'ionic-angular';
import { Category } from '../../category';
import { Priority } from '../../priority';
import { ColorPicker } from './color-picker.component';

@Component({
    templateUrl: 'add-category.html'
})

export class AddCategory implements OnInit{
    constructor(public viewCntrl: ViewController,private todoService: TodoService, public navCntrl: NavController){

    }
    
    private ColorArray: string[];
    private TestArray: string[] = ["hi there", "h#d", "#yolo2"];
    colorPicker: boolean = true;

    ngOnInit(): void {
        this.todoService.getColors().then(ColorArray => this.ColorArray = ColorArray);
    }
    
    priority = Priority;
    prior() : Array<string> {
        var keys = Object.keys(this.priority);
        return keys.slice(keys.length / 2);
    }
    
    presentColors(){
        this.colorPicker = !this.colorPicker;
        console.log("color picker is" + this.colorPicker);
    }

    setColor(color){
        var colorIndex = this.ColorArray.indexOf(color);
        console.log(colorIndex);
        this.newCate.Color = colorIndex;

    }

    newCate = new Category(undefined, undefined, undefined);
    onNewCatFormSubmit(){
        this.viewCntrl.dismiss();
    }
}