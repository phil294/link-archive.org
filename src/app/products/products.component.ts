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
import {AttributeService} from "../attribute.service";
import {Attribute} from "../model/Attribute";
import {Product} from "../model/Product";

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit
{

	private products: Product[] = [];
	private attributes: Attribute[] = [];
	private relevantAttributes: Attribute[] = [];
	val = val;

	private filters: Map<number,string> = new Map<number,string>();
	private sorters: Array<[number, SortingOrder]> = [];
	private showAttributes: Set<number> = new Set<number>();
	private rows: number = 5;
	private columns: number = 5;

	constructor(private searchService: SearchService, private attributeService: AttributeService) {

	}

	private sortersChanged(sorters: Array<[number, SortingOrder]>) {
		this.sorters = sorters;
		this.doSearch();
	}

	private doSearch(): void {
		//	this.filters.set(8, "2");
		//	this.filters.set(5, "Coupe");
		//	this.sorters.set(7, SortingOrder.DESC);
		//	this.showAttributes.add(14);
		//	this.showAttributes.add(17);
		this.rows = 100;
		this.columns = 10;
		this.searchService.search(this.filters, this.sorters, this.showAttributes, this.rows, this.columns)
			.subscribe((products: any) => {
				this.products = products;
				this.setRelevantAttributes();
			});
	}

	private getAttributes(): void {
		this.attributeService.getAttributes()
			.subscribe((attributes: Attribute[]) => {
				this.attributes = attributes;
				this.setRelevantAttributes();
			})
	}

	private setRelevantAttributes(): void {
		// when both initialized
		if(val(this.products) && val(this.attributes)) {
			// for table: shown attributes
			this.relevantAttributes = this.attributes.filter((a: Attribute) => this.products[0].productData.hasOwnProperty(a.id));
		}
	}

	ngOnInit(): void {
		this.doSearch();
		this.getAttributes();
	}
}
