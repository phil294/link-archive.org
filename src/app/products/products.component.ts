/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Component, OnInit} from "@angular/core";
import {SearchService} from "../search.service";
import {val} from "../helpers";
import {SearchResponse} from "../model/search-response";
import {Product} from "../model/Product";
import {Attribute} from "../model/Attribute";
import {ProductService} from "../product.service";
import {ProductValue} from "../model/ProductValue";

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

	searchResponse: SearchResponse = new SearchResponse;
	newProduct: Product = new Product();
	val = val;

	constructor(private searchService: SearchService, private productService: ProductService) {

	}

	ngOnInit(): void {
		this.searchService.search()
			.subscribe((products: any) => this.searchResponse = products);
	}

	changeProductName(product: Product, name: string) {
		if(product.name == name) {
			return; // no change
		}
		product.name = name;
		this.productService.changeProduct(product)
			.subscribe();
	}

	changeProductValue(product: Product, attribute: Attribute, value: string) {
		let previousValue = "";
		if(val(product.productData[attribute.id])) {
			previousValue = product.productData[attribute.id].value;
		}
		if(previousValue == value) {
			return; // no change
		}
		let productValue = new ProductValue();
		productValue.value = value;
		product.productData[attribute.id] = productValue;
		this.productService.changeProduct(product)
			.subscribe();
	}

	addProduct(product: Product):void {
		this.productService.addProduct(product)
			.subscribe((addedProduct: Product) => {
				this.newProduct = new Product();
				this.searchResponse.products.push(addedProduct);
			});
	}
}
