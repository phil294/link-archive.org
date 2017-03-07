/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule, XHRBackend, RequestOptions} from "@angular/http";
import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {AuthGuard} from "./auth/auth.guard";
import {AuthenticationService} from "./auth/authentication.service";
import {HttpApi} from "./http-api.service";
import {FlexLayoutModule} from "@angular/flex-layout";
import {GlobalService} from "./global.service";
import {CheckboxComponent} from "./checkbox/checkbox.component";
import {ProductsComponent} from "./products/products.component";
import {LoginComponent} from "./login/login.component";
import {ProfileComponent} from "./profile/profile.component";
import {SearchService} from "./products.service";

@NgModule({
	declarations: [
		AppComponent,
		CheckboxComponent,
		ProductsComponent,
		LoginComponent,
		ProfileComponent,
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		FlexLayoutModule,

		routing,
	],
	providers: [
		AuthGuard,
		AuthenticationService,
		GlobalService,
		SearchService,
		{
			provide: HttpApi,
			useFactory: httpApiFactory,
			deps: [XHRBackend, RequestOptions, GlobalService]
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}

/* muss ausgelagert sein sonst ng serve probleme */
export function httpApiFactory(backend: XHRBackend, options: RequestOptions, globalService: GlobalService) {
	return new HttpApi(backend, options, globalService);
}