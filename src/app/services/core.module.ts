import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';
import { SettingsService } from "./settings.service";
import { TodoService } from "./todo.service";
import { UserService } from "./user.service";

@NgModule({
	imports: [ HttpModule ],
	exports: [],
	// services only, no components!
	declarations: [],
	providers: [ SettingsService, UserService, TodoService ],
})
export class CoreModule { }