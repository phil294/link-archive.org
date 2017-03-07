/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
export class ProductValue {
	id: number;
	value: string;
	submitted: number;
	interest: number;

	static fromJson(productValue_json: any): ProductValue {
		let productValue = Object.assign(new ProductValue(), productValue_json);
		return productValue;
	}
}