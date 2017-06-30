// import { ComponentFixture, async, TestBed } from '@angular/core/testing';
// import { By } from '@angular/platform-browser';
// import { DebugElement } from '@angular/core';
// import { ComponentFixtureAutoDetect } from '@angular/core/testing';
// import { Http, RequestOptions } from '@angular/http';
// import { AuthHttp, AuthConfig } from 'angular2-jwt';
// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';

// import { IonicModule, Platform } from 'ionic-angular';
// import { CoreModule } from './services/core.module';
// import { SharedModule } from './shared.module';
// import { SettingsModule } from '../pages/settings/settings.module';
// import { TodosModule } from '../pages/todos/todos.module';
// import { SideMenuModule } from '../pages/side-menu/side-menu.module';
// import { TabsModule } from '../pages/tabs/tabs.module';

// import { MyApp } from './app.component';
// import { AuthHttpServiceFactoryMock, 
// 	PlatformMock, 
// 	StatusBarMock, 
// 	SplashScreenMock } from "../../test-config/mocks-ionic";

// describe('Root component (inline template)', () => {

// 	let comp: MyApp;
// 	let fixture: ComponentFixture<MyApp>;
// 	let de: DebugElement;
// 	let el: HTMLElement;

// 	// async beforeEach (to allow external templates to be compiled)
// 	beforeEach(async () => {
// 		TestBed.configureTestingModule({
// 			// declare comps to test
// 			declarations: [MyApp],
// 			imports: [IonicModule.forRoot(MyApp),
// 				SideMenuModule,
// 				CoreModule,
// 				SharedModule,
// 				SettingsModule,
// 				TodosModule,
// 				SideMenuModule,
// 				TabsModule],
// 			providers: [
// 				// detects comp changes sometimes
// 				// NOTE: call detectChanges() every time to be safe
// 				{ provide: ComponentFixtureAutoDetect, useValue: true },
// 				{ provide: AuthHttp, useFactory: AuthHttpServiceFactoryMock, deps: [Http, RequestOptions] },
// 				{ provide: StatusBar, useClass: StatusBarMock },
//         { provide: SplashScreen, useClass: SplashScreenMock },
//         { provide: Platform, useClass: PlatformMock }
// 			]
// 		})
// 			// compile template and css
// 			// NOTE: DO NOT config TestBed after method below
// 			.compileComponents();
// 	});

// 	// synchronous beforeEach (waits for async beforeEach above to complete)
// 	beforeEach(() => {
// 		fixture = TestBed.createComponent(MyApp);
// 		// MyApp test instance
// 		comp = fixture.componentInstance;

// 		// query for the title <h1> by CSS element selector
// 		de = fixture.debugElement.query(By.css('h1'));
// 		el = de.nativeElement;
// 	});

// 	it('should display original title', () => {
// 		// always call this when changing something in comp
// 		fixture.detectChanges();
// 		expect(el.textContent).toContain(comp.title);
// 	});

// 	it('should display a different test title', () => {
// 		comp.title = 'Test Title';
// 		fixture.detectChanges();
// 		expect(el.textContent).toContain('Test Title');
// 	});
// });