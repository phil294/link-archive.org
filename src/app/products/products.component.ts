/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Component, OnInit} from "@angular/core";
import {SearchService, SortingOrder} from "../search.service";
import {val} from "../helpers";
import {SearchResponse} from "../model/search-response";
import {AttributeService} from "../attribute.service";

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

	searchResponse: SearchResponse = new SearchResponse;
	val = val;

	private filters: Map<number,string> = new Map<number,string>();
	private sorters: Map<number, SortingOrder> = new Map<number, SortingOrder>();
	private showAttributes: Set<number> = new Set<number>();
	private rows: number = 5;
	private columns: number = 5;

	constructor(private searchService: SearchService, private attributeService: AttributeService) {

	}

	ngOnInit(): void {
		//	this.filters.set(8, "2");
		//	this.filters.set(5, "Coupe");
		//	this.sorters.set(7, SortingOrder.DESC);
		//	this.showAttributes.add(14);
		//	this.showAttributes.add(17);
		this.rows = 100;
		this.columns = 10;
		this.searchService.search(this.filters, this.sorters, this.showAttributes, this.rows, this.columns)
			.subscribe((products: any) => {
				this.searchResponse = products;
			});
	}
}
