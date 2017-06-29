import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { async } from '@angular/core/testing';

import { MyApp } from './app.component';

describe('Root component (inline template)', () => {

	let comp: MyApp;
	let fixture: ComponentFixture<MyApp>;
	let de: DebugElement;
	let el: HTMLElement;

	// async beforeEach to allow external templates to be compiled
	beforeEach(async () => {
		TestBed.configureTestingModule({
			// declare comps to test
			declarations: [MyApp],
			providers: [
				// detects comp changes sometimes
				// NOTE: call detectChanges() every time to be safe
				{ provide: ComponentFixtureAutoDetect, useValue: true }
			]
		}).compileComponents();  // compile template and css

		fixture = TestBed.createComponent(MyApp);

		comp = fixture.componentInstance; // BannerComponent test instance

		// query for the title <h1> by CSS element selector
		de = fixture.debugElement.query(By.css('h1'));
		el = de.nativeElement;
	});

	it('should display original title', () => {
		// always call this when changing something in comp
		fixture.detectChanges();
		expect(el.textContent).toContain(comp.title);
	});

	it('should display a different test title', () => {
		comp.title = 'Test Title';
		fixture.detectChanges();
		expect(el.textContent).toContain('Test Title');
	});
});

// import { async, TestBed } from '@angular/core/testing';
// import { IonicModule, Platform } from 'ionic-angular';

// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';

// import { MyApp } from './app.component';
// import { SideMenu } from '../pages/side-menu/side-menu.component';
// import { AppModule } from './app.module';
// import {
//   PlatformMock,
//   StatusBarMock,
//   SplashScreenMock
// } from '../../test-config/mocks-ionic';
// import { NO_ERRORS_SCHEMA } from '@angular/core';

// xdescribe('MyApp Component', () => {
//   let fixture;
//   let component;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ MyApp ],
// 			schemas: [ NO_ERRORS_SCHEMA ],
//       // imports: [
//       //   IonicModule.forRoot(MyApp)
//       // ],
//       providers: [
//         { provide: StatusBar, useClass: StatusBarMock },
//         { provide: SplashScreen, useClass: SplashScreenMock },
//         { provide: Platform, useClass: PlatformMock }
//       ]
//     }).compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(MyApp);
//     component = fixture.componentInstance;
//   });

//   it('should be true', () => {
//     expect(true).toBe(true);
//   });

// });