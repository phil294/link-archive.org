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
@Injectable()
export class GlobalService {
	private loggedInUserSource = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('ls_currentUser')));
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