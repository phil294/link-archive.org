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
import {Attribute} from "../model/Attribute";
import {Product} from "../model/Product";
import {Filter} from "../model/Filter";
import {SearchResponse} from "../model/SearchResponse";

/**
 * Hauptsicht.
 * Filter konfigurieren,
 * Anzeige-Attribute (showers) konfigurieren,
 * Limit (rows) konfigurieren.
 */
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

	constructor(private searchService: SearchService, private attributeService: AttributeService) {

	}

	/**
	 * Entferne Anzeigeattribut und schicke Suchanfrage ab
	 * @param attribute
	 */
	private removeShower(attribute: number) {
		this.showers.delete(attribute);
		this.doSearch();
	}

	/**
	 * Füge Anzeigeattribut hinzu und schicke Suchanfrage ab
	 * @param attribute
	 */
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

	/**
	 * Füge konfigurierten Filter hinzu und schicke Suchanfrage ab
	 * @param event
	 * @param attribute
	 * @param filter
	 */
	private addFilter(event: Event, attribute: Attribute, filter) {
		event.preventDefault();
		this.filters.set(attribute.id, filter);
		this.newFilter = new Filter();
		this.filterattribute = null;
		this.doSearch();
	}

	/**
	 * Entferne Filter und schicke Suchanfrage ab
	 * @param attribute
	 */
	private removeFilter(attribute: number) {
		this.filters.delete(attribute);
		this.doSearch();
	}

	/**
	 * Sortierreihenfolge hat sich in irgend einer Art geändert. Neue Suchanfrage.
	 * @param sorters
	 */
	private sortersChanged(sorters: Array<[number, SortingOrder]>) {
		this.sorters = sorters;
		this.doSearch();
	}

	/**
	 * Attributmenge hat sich in irgend einer Art geändert (durch Administrator-Interaktion). Neue Suchanfrage.
	 */
	private attributesChanged() {
		this.getAttributes();
		this.doSearch();
	}

	/**
	 * Suchanfrage abschicken. Schickt Filter, Sortierer, Anzeigeattribute, Zeilenlimit und minimale Spaltenanzahl (s. determineColumns()) mit.
	 */
	private doSearch(): void {
		this.searchService.search(this.filters, this.sorters, this.showers, this.rows, this.determineColumns())
			.subscribe((searchResponse: SearchResponse) => {
				this.products = searchResponse.products;
				this.attributeOrder = searchResponse.attributeOrder;
				this.setRelevantAttributes();
			});
	}

	/**
	 * Bestimme minimale Spaltenanzahl in Abhängigkeit der Fenstergröße.
	 * @returns {number}
	 */
	private determineColumns(): number {
		return Math.round(window.innerWidth / 165);
	}

	/**
	 * Setze alle Attribut-Konfigurationen zurück (nach Administrator-Interaktion) und
	 * Hole einmalig alle Attribute vom Server.
	 */
	private getAttributes(): void {
		this.attributeOrder = [];
		this.attributes = [];
		this.relevantAttributes = [];
		this.sorters = [];
		this.showers = new Set<number>();
		this.filters = new Map<number,Filter>();
		this.newFilter = new Filter();
		this.filterattribute = null;
		this.showerattribute = null;

		this.attributeService.getAttributes()
			.subscribe((attributes: Attribute[]) => {
				this.attributes = attributes;
				this.setRelevantAttributes();
			})
	}

	/**
	 * Relevante Attribute sind jene, die in den Produktwerten enthalten sind, also in der result-table Tabelle angezeigt werden.
	 */
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
