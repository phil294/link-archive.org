/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Injectable} from "@angular/core";
import {Response} from "@angular/http";
import "rxjs/add/operator/map";
import {HttpApi} from "../http-api.service";
import {GlobalService} from "../global.service";
import {User} from "../model/user";

@Injectable()
export class AuthenticationService {
	constructor(protected http: HttpApi,
				private globalService: GlobalService) {

	}

	/**
	 * Frage Server, ob die eingegebenen Daten stimmen.
	 * @param user
	 * @returns {Observable<R>}
	 */
	login(user: User) {
		return this.http.post('/login',
			JSON.stringify(user))
			.map((response: Response) => {
				let user = response.json();
				if (user && user.token) {
					this.globalService.setLoggedInUser(user);
				}
			});
	}

	logout() {
		this.globalService.setLoggedInUser(new User());
	}
}