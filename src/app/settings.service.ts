import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class SettingsService{
    private theme: BehaviorSubject<string>;
    availableThemes: {className: string, displayName: string}[];

    constructor(){
        this.theme = new BehaviorSubject('aqua-theme');
        this.availableThemes = [
            {className: 'aqua-theme', displayName: 'Aqua'},
            {className: 'red-theme', displayName: 'Red'}
        ];
    }

    setTheme(val){
        this.theme.next(val);
    }

    getTheme(){
        return this.theme.asObservable();
    }
}