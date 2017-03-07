/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";

@Component({
	templateUrl: './checkbox.component.html',
	styleUrls: ['./checkbox.component.css'],
	selector: "checkbox"
})
export class CheckboxComponent implements OnInit {

	@Input() checked: boolean;
	@Output() onChecked = new EventEmitter();
	@Output() onUnchecked = new EventEmitter();

	constructor() {

	}

	ngOnInit(): void {

	}

	setInactive(): void {
		this.onUnchecked.emit();
	}

	setActive(): void {
		this.onChecked.emit();
	}
}
