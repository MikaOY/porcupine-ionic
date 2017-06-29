import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";

import { MyApp } from "../../app/app.component";
import { SettingsPage } from './settings';

@NgModule({
	imports: [IonicModule.forRoot(MyApp)],
	exports: [SettingsPage],
	declarations: [SettingsPage],
	providers: [],
})
export class SettingsModule { }
