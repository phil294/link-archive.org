import {Attribute} from "./Attribute";
import {Product} from "./Product";
/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
export class SearchResponse {
	products: Product[];
	attributes: Attribute[];

	static fromJson(json: any): SearchResponse  {
		let resp = new SearchResponse();
		let products = Product.fromJsons(json.products);
		let attributes = Attribute.fromJsons(json.attributes);
		resp.products = products;
		resp.attributes = attributes;
		return resp;
	}
}