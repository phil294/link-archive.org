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

@Injectable()
export class GlobalService {
	private loggedInUserSource = new BehaviorSubject<User>(this.initUser());

	private initUser(): User {
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