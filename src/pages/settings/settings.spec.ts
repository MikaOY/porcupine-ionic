import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { ModalController, NavController } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs/Rx';

import { AppModule } from "../../app/app.module";
import { SettingsModule } from './settings.module';
import { NavParams } from 'ionic-angular';
import { click } from '../../../test-config/index';

import { SettingsPage } from './settings';
import { SettingsService } from '../../app/services/settings.service';
import { UserService } from '../../app/services/user.service';
import { TodoService } from '../../app/services/todo.service';
import { Category } from '../../app/classes/category';
import { Board } from '../../app/classes/board';

let comp: SettingsPage;
let fixture: ComponentFixture<SettingsPage>;

let tServ;

// stub must have props and methods used in testing, but is NOT used
let todoServiceStub = {
	
};

let settingsServiceStub = {
	getTheme() {
		return  new BehaviorSubject('null').asObservable();
	},

	availableThemes: [
			{ className: 'aqua-theme', displayName: 'Aqua' },
			{ className: 'red-theme', displayName: 'Red' },
			{ className: 'null', displayName: 'Default' }
		],
};

let userServiceStub = {
	
};

describe('SettingsPage', () => {
	
	// async beforeEach (to allow external templates to be compiled)
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [],
			imports: [AppModule, SettingsModule],
			// NO! Don't provide the real service!
			// providers:    [ UserService ]  
			// Provide a test-double instead
			providers: [
				{ provide: NavController },
				{ provide: ModalController },
				{ provide: SettingsService, useValue: settingsServiceStub },
				{ provide: UserService, useValue: userServiceStub },
				{ provide: TodoService, useValue: todoServiceStub }
			]
		})
			// compile template and css
			// NOTE: DO NOT config TestBed after method below
			.compileComponents();
	}));

	// synchronous beforeEach (waits for async beforeEach above to complete)
	beforeEach(() => {
		fixture = TestBed.createComponent(SettingsPage);
		comp = fixture.componentInstance;
		// get todoService actually injected
		// this one is the 'service' actually used in testing
		tServ = fixture.debugElement.injector.get(TodoService);
		// also can: get todoService from the root injector
		// todoService = TestBed.get(TodoService);
		
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(comp instanceof SettingsPage).toBe(true);
	});

});