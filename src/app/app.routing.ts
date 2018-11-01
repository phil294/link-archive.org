/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {AuthGuard} from "./auth/auth.guard";
import {ProductsComponent} from "./products/products.component";
import {ProfileComponent} from "./profile/profile.component";
import {LoginComponent} from "./login/login.component";

const appRoutes: Routes = [
	{path: 'products', component: ProductsComponent},
	{path: "profile", component: ProfileComponent, canActivate: [AuthGuard]},
	{path: "login", component: LoginComponent},

	{path: '**', redirectTo: 'products'},
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);