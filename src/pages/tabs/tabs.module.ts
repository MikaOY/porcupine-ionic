import { NgModule } from '@angular/core';
import { IonicModule } from "ionic-angular";

import { MyApp } from "../../app/app.component";
import { TodosModule } from '../todos/todos.module';
import { SettingsModule } from '../settings/settings.module';
import { TabsPage } from './tabs';

@NgModule({
	imports: [
		IonicModule.forRoot(MyApp),
		TodosModule,
		SettingsModule
	],
	exports: [TabsPage],
	declarations: [TabsPage],
	providers: [],
})
export class TabsModule { }
