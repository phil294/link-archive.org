/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Injectable} from "@angular/core";
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {GlobalService} from "../global.service";

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(private router: Router, private globalService: GlobalService) {
	}

	/**
	 * Kann Sicht auf Routen verwehren. Liefert keinen sicheren Schutz vor unbefugtem Zugriff
	 * @param route
	 * @param state
	 * @returns {boolean}
	 */
	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
		let currentUser = this.globalService.getCurrentlyLoggedInUser();
		if (currentUser && currentUser.token) {
			return true;
		}
		this.router.navigate(['/login']);
		return false;
	}
}
