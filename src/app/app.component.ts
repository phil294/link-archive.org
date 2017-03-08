import {Component, OnInit} from "@angular/core";
import {User} from "./model/user";
import {GlobalService} from "./global.service";

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
	currentUser: User = new User();
	constructor(private globalService: GlobalService) {

	}

	ngOnInit(): void {
		this.globalService.loggedInUser$.subscribe(user => this.currentUser = user);
		this.currentUser = this.globalService.getCurrentlyLoggedInUser();
	}
}