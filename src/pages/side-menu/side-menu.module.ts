import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';

import { SideMenu } from './side-menu.component';
import { ProfilePage } from './profile/profile.component';
import { BoardManager } from './board-manager/board-manager.component';
import { UnlockPage } from './board-manager/unlock-page/unlock-page.component';
import { MyApp } from '../../app/app.component';

@NgModule({
	imports: [IonicModule.forRoot(MyApp)],
	exports: [SideMenu],
	declarations: [
		SideMenu,
		ProfilePage,
		BoardManager,
		UnlockPage,
	],
	providers: [],
	entryComponents: [SideMenu, BoardManager, UnlockPage]
})
export class SideMenuModule { }
