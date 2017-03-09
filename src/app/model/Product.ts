import {ProductValue} from "./ProductValue";
import {value} from "../helpers";
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
	productData: Map<number, ProductValue>; // <attributeId, prodVal>

	static fromJsons(products_json: any): Product[] {
		let products: Product[] = [];
		for(let product_json of products_json) {
			products.push(Product.fromJson(product_json));
		}
		return products;
	}
	static fromJson(product_json: any): Product {
		let product = Object.assign(new Product(), product_json);
		let productData_json = product_json.productData;
		let productData = new Map<number, ProductValue>();
		if(value(productData_json)) {
			for(let key_attribute in productData_json) {
				if(productData_json.hasOwnProperty(key_attribute)) {
					let productValue_json = productData_json[key_attribute];
					let productValue = ProductValue.fromJson(productValue_json);
					productData.set(+key_attribute, productValue);
				}
			}
		}
		product.productData = productData;
		return product;
	}
}