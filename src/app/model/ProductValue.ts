/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
export class ProductValueOLD // todo löschen?
{
	id: number;
	value: string;
	submitted: number;
	interest: number;

	static fromJson(productValue_json: any): ProductValueOLD {
		let productValue = Object.assign(new ProductValueOLD(), productValue_json);
		return productValue;
	}
}