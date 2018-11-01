/**
 * User: phi
 * Date: 07.03.17
 * .  .___.
 * .  {o,o}
 * . /)___)
 * . --"-"--
 */
export class Product {
	id: number;
	name: string;
	description: string;
	picture: string;
	//productData: Map<number, ProductValue> = new Map(); // <attributeId, prodVal>
	productData: Object;

	/**
	 * Serialisierung.
	 * @param products_json
	 * @returns {Product[]}
	 */
	static fromJsons(products_json: any): Product[] {
		let products: Product[] = [];
		for(let product_json of products_json) {
			products.push(Product.fromJson(product_json));
		}
		return products;
	}

	/**
	 * Serialisierung.
	 * @param product_json
	 * @returns {Product&U}
	 */
	static fromJson(product_json: any): Product {
		let product = Object.assign(new Product(), product_json);
		return product;
	}
}