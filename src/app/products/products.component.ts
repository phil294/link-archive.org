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
import {AttributeService} from "../attribute.service";

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

	searchResponse: SearchResponse = new SearchResponse;
	newProduct: Product = new Product();
	newAttribute: Attribute = new Attribute();
	val = val;

	constructor(private searchService: SearchService, private productService: ProductService, private attributeService: AttributeService) {

	}

	ngOnInit(): void {
		this.searchService.search()
			.subscribe((products: any) => this.searchResponse = products);
/*		let map = new Map;
		map.set("a", "a");
		map.set("b", "b");
		this.test = {
			object: {
				a: "a",
				b: "b",
				c: false,
				d: true
			},
			array: [ "a","b" ],
				literal: "ab",
			map: map,
			null: null
		}; */
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
		if(val(product.productData[attribute.id])) {
			let previousValue = product.productData[attribute.id].value;
			if(previousValue == value) {
				return; // no change
			}
		} else {
			// no value yet
			if(value=="") {
				return;
			}
			product.productData[attribute.id] = new ProductValue();
		}
		//let productValue = new ProductValue();
		//productValue.value = value;
		//product.productData[attribute.id] = productValue;
		//this.productService.changeProduct(product)
		//	.subscribe();
		product.productData[attribute.id].value = value;
		this.productService.changeProductValue(product.id, attribute.id, value)
			.subscribe();
	}

	addProduct(product: Product):void {
		this.productService.addProduct(product)
			.subscribe((addedProduct: Product) => {
				this.newProduct = new Product();
				this.searchResponse.products.push(addedProduct);
			});
	}

	deleteProduct(product: Product): void {
		if(!confirm("Delete product '"+product.name+"'?")) {
			return;
		}
		this.productService.deleteProduct(product.id)
			.subscribe(wat => {
				this.searchResponse.products = this.searchResponse.products.filter(p => p.id != product.id); // remove successfully deleted item
			});
	}

	changeAttributeName(attribute: Attribute, newName: string): void {
		if(attribute.name == newName) {
			return; //nochange
		}
		attribute.name = newName;
		this.attributeService.changeAttribute(attribute)
			.subscribe();
	}

	addAttribute(attribute: Attribute): void {
		this.attributeService.addAttribute(attribute)
			.subscribe((addedAttribute: Attribute) => {
				this.newAttribute = new Attribute();
				this.searchResponse.attributes.push(addedAttribute);
			});
	}

	deleteAttribute(attribute: Attribute): void {
		if(!confirm("Delete attribute '"+attribute.name+"'?")) {
			return;
		}
		this.attributeService.deleteAttribute(attribute.id)
			.subscribe(wat => {
				this.searchResponse.attributes = this.searchResponse.attributes.filter(a => a.id != attribute.id); // remove successfully deleted attr
			});
	}
}
