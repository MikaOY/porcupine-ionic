import { Component } from '@angular/core';

import { TodosPage } from '../todos/todos';
import { SettingsPage } from '../settings/settings';

@Component({
	templateUrl: 'tabs.html'
})

export class TabsPage {

	tab1Root = TodosPage;
	tab2Root = SettingsPage;

	constructor() { }
}
