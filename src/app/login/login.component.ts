/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Component, OnInit} from "@angular/core";
import {AuthenticationService} from "../auth/authentication.service";
import {User} from "../model/user";
import {Router} from "@angular/router";
import {Response} from "@angular/http";

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	user: User = new User;
	invalid: boolean = false;
	loading: boolean = false;

	constructor(private authenticationService: AuthenticationService, private router: Router) {

	}

	ngOnInit(): void {
		this.authenticationService.logout();
	}

	login() {
		this.loading = true;
		this.authenticationService.login(this.user)
			.subscribe(wat => {
				this.router.navigate(['/']); // toto ? & '' ?
			}, (error:Response) => {
				this.loading = false;
				if(error.status >= 400 && error.status < 500) {
					this.invalid = true;
				}
			})
	}
}
