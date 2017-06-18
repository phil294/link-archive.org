/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Component, OnInit} from "@angular/core";
import {SearchService, SortingOrder, FilterType} from "../search.service";
import {val} from "../helpers";
import {AttributeService} from "../attribute.service";
import {Attribute, AttributeType} from "../model/Attribute";
import {Product} from "../model/Product";
import {Filter} from "../model/Filter";
import {SearchResponse} from "../model/SearchResponse";

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit
{

	private products: Product[] = [];
	private attributeOrder: number[] = [];
	private attributes: Attribute[] = [];
	private relevantAttributes: Attribute[] = [];
	val = val;
	FilterType = FilterType;
	AttributeType = AttributeType;

	private filterbox: string = "";
	private filtertype: FilterType = FilterType.VALUE;
	private newFilter = new Filter();
	private filters: Map<number,Filter> = new Map<number,Filter>();
	private filterattribute: Attribute = null;

	private showerbox: string = "";
	private showerattribute: Attribute = null;

	private sorters: Array<[number, SortingOrder]> = [];
	private showers: Set<number> = new Set<number>();
	private rows: number = 20;
	private columns: number = 5;

	constructor(private searchService: SearchService, private attributeService: AttributeService) {

	}

	private removeShower(attribute: number) {
		this.showers.delete(attribute);
		this.doSearch();
	}

	private addShower(attribute: Attribute) {
		this.showers.add(attribute.id);
		this.showerattribute = null;
		this.doSearch();
	}

	/* wtf angular? */
	private filtersToIterable() {
		let ret = [];
		this.filters.forEach((filter, attr) => {
			ret.push({
				attribute: attr,
				filter: filter
			});
		});
		return ret;
	}

	private attributeById(id: number) {
		return this.attributes.find(a => a.id == id);
	}

	private addFilter(event: Event, attribute: Attribute, filter) {
		event.preventDefault();
		this.filters.set(attribute.id, filter);
		this.newFilter = new Filter();
		this.filterattribute = null;
		this.doSearch();
	}

	private removeFilter(attribute: number) {
		this.filters.delete(attribute);
		this.doSearch();
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
		//  this.rows = 100;
		//  this.columns = 10;
		this.searchService.search(this.filters, this.sorters, this.showers, this.rows, this.columns)
			.subscribe((searchResponse: SearchResponse) => {
				this.products = searchResponse.products;
				this.attributeOrder = searchResponse.attributeOrder;
				this.setRelevantAttributes();
			});
	}

	private getAttributes(): void {
		this.attributeService.getAttributes()
			.subscribe((attributes: Attribute[]) => {
				//attributes.forEach(a => a.type = AttributeType.number); // fixme
				this.attributes = attributes;
				this.setRelevantAttributes();
			})
	}

	private setRelevantAttributes(): void {
		// when both initialized
		if(val(this.attributeOrder) && val(this.attributes)) {
			// for table: shown attributes
			//this.relevantAttributes = this.attributes.filter((a: Attribute) => this.products[0].productData.hasOwnProperty(a.id));
			this.relevantAttributes = this.attributeOrder.map((attr: number) => this.attributes.find(a => a.id == attr));
		}
	}

	ngOnInit(): void {
		this.doSearch();
		this.getAttributes();
	}
}
