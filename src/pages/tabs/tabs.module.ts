
import { NgModule } from '@angular/core';

import { TodosModule } from '../todos/todos.module';
import { SettingsModule } from '../settings/settings.module';
import { TabsPage } from './tabs';

@NgModule({
	imports: [ 
		TodosModule,
		SettingsModule
	],
	exports: [ TabsPage ],
	declarations: [ TabsPage ],
	providers: [],
})
export class TabsModule { }
