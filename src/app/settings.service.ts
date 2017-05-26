import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class SettingsService{
    private theme: BehaviorSubject<string>;
    availableThemes: {className: string, displayName: string}[];

    constructor(){
        this.theme = new BehaviorSubject('');
        this.availableThemes = [
            {className: 'aqua-theme', displayName: 'Aqua'},
            {className: 'red-theme', displayName: 'Red'},
            {className: 'null', displayName: 'Default'}
        ];
    }

    setTheme(val){
        this.theme.next(val);
    }

    getTheme(){
        return this.theme.asObservable();
    }
}