/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 * 20.02.17
 */
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {HttpApi} from "./http-api.service";
import {Response} from "@angular/http";
import {Product} from "./model/Product";

@Injectable()
export class ProductService {
	constructor(protected http: HttpApi) {

	}
	addProduct(product: Product) {
		return this.http.post("/product", JSON.stringify(product))
			.map((resp:Response) => Product.fromJson(resp.json()));
	}
	changeProduct(product: Product) {
		return this.http.put(`/product/${product.id}`, JSON.stringify(product))
			.map((resp:Response) => Product.fromJson(resp.json()));
	}
	changeProductValue(productId: number, attributeId: number, newValue: string) {
		return this.http.put(`/product/${productId}/attribute/${attributeId}`, newValue);
	}
	deleteProduct(productId: number) {
		return this.http.delete(`/product/${productId}`);
	}
}