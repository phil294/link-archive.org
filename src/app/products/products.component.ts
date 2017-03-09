/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Component, OnInit} from "@angular/core";
import {SearchService} from "../products.service";
import {val} from "../helpers";
import {SearchResponse} from "../model/search-response";
import {Product} from "../model/Product";
import {Attribute} from "../model/Attribute";

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

	searchResponse: SearchResponse = new SearchResponse;
	val = val;

	constructor(private searchService: SearchService) {

	}

	ngOnInit(): void {
		this.searchService.search()
			.subscribe((products: any) => this.searchResponse = products);
	}

	changeProductName(product: Product, name: string) {
		if(product.name == name) {
			return; // no change
		}
		console.dir("change product id "+product.id+" name to "+name);
	}

	changeProductValue(product: Product, attribute: Attribute, value: string) {
		let previousValue = "";
		if(val(product.productData.get(attribute.id))) {
			previousValue = product.productData.get(attribute.id).value;
		}
		if(previousValue == value) {
			return; // no change
		}
		console.dir("change prod "+product.id+" attr "+attribute.id+" to "+value);
	}

}
