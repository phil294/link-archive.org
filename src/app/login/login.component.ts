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

@Component({
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	user: User = new User;

	constructor(private authenticationService: AuthenticationService) {

	}

	ngOnInit(): void {
		this.authenticationService.logout();
	}

	login() {
		this.authenticationService.login(this.user)
			.subscribe(wat => {

			})
	}
}
