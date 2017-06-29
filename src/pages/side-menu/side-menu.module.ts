import { NgModule } from '@angular/core';

import { SharedModule } from '../../app/shared.module';
import { SideMenu } from './side-menu.component';
import { Profile } from './profile.component';
import { BoardManager } from './board-manager.component';
import { AddCategory } from './add-category.component';

@NgModule({
	imports: [],
	exports: [ SideMenu ],
	declarations: [
		SideMenu,
		Profile,
		BoardManager,
		AddCategory
	],
	providers: [],
})
export class SideMenuModule { }
