/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Injectable} from "@angular/core";
import {User} from "./model/user";
import {BehaviorSubject} from "rxjs";
import {val} from "./helpers";

/**
 * Verfügt über Objekte, die in der gesamten Applikation sichtbar sein sollen. Möglichst vermeiden.
 */
@Injectable()
export class GlobalService {
	private loggedInUserSource = new BehaviorSubject<User>(GlobalService.initUser());

	private static initUser(): User {
		let storedUser = JSON.parse(localStorage.getItem('ls_currentUser'));
		if(val(storedUser)) {
			return storedUser;
		} else {
			return new User();
		}
	}
	// Observable string stream
	loggedInUser$ = this.loggedInUserSource.asObservable();
	// Service message command
	setLoggedInUser(user: User) {
		localStorage.setItem('ls_currentUser', JSON.stringify(user));
		this.loggedInUserSource.next(user);
	}

	getCurrentlyLoggedInUser() {
		return this.loggedInUserSource.getValue();
	}
}