import {val} from "../helpers";
/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
export enum AttributeType { // literals used in html-inputs
	number,
	string
}
export class Attribute {
	id: number;
	name: string;
	type: AttributeType;
	description: string;
	interest: number;
	unit: string;

	static fromJsons(attributes_json: any): Attribute[] {
		let attributes: Attribute[] = [];
		if(val(attributes_json)) {
			for(let attribute_json of attributes_json) {
				attributes.push(Attribute.fromJson(attribute_json));
			}
		}
		return attributes;
	}
	static fromJson(attribute_json: any): Attribute {
		let attribute = Object.assign(new Attribute(), attribute_json);
		return attribute;
	}
}