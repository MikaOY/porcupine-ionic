import { NgModule } from '@angular/core';

import { SideMenu } from './side-menu.component';
import { ProfilePage } from './profile/profile.component';
import { BoardManager } from './board-manager/board-manager.component';
import { UnlockPage } from './board-manager/unlock-page/unlock-page.component';
import { SharePage } from './board-manager/share-page/share-page.component';
import { AddCategory } from './add-category/add-category.component';

@NgModule({
	imports: [],
	exports: [ SideMenu ],
	declarations: [
		SideMenu,
		ProfilePage,
		BoardManager,
		AddCategory,
		UnlockPage,
		SharePage
	],
	providers: [],
})
export class SideMenuModule { }
