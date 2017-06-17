/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 * 20160309
 */
import {Component, Input, EventEmitter, Output} from "@angular/core";
import {val} from "../../helpers";

@Component({
	templateUrl: './editable-value-dialog.component.html',
	styleUrls: ['./editable-value-dialog.component.css'],
	selector: 'editable-value-dialog',
})
export class EditableValueDialogComponent {

	val = val;
	@Input() editable: boolean = false;
	@Input() value: string = "";
	@Input() unit: string = "";
	private editDialog: boolean = false;
	@Output() valueChanged: EventEmitter<string> = new EventEmitter();
}
