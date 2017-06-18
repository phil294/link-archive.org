import {Product} from "./Product";
/**
 * User: phi
 * Date: 14.06.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
export class SearchResponse
{
	products: Product[] = [];
	attributeOrder: number[] = [];

	static fromJsons(products_json: any): Product[] {
		let products: Product[] = [];
		for(let product_json of products_json) {
			products.push(Product.fromJson(product_json));
		}
		return products;
	}

	static fromJson(search_response_json: any): SearchResponse {
		let searchResponse: SearchResponse = Object.assign(new SearchResponse(), search_response_json);
		let products = Product.fromJsons(search_response_json.products);
		searchResponse.products = products;
		console.log(searchResponse);
		return searchResponse;
	}
}