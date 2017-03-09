/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Component, OnInit} from "@angular/core";
import {SearchService} from "../products.service";
import {value} from "../helpers";
import {SearchResponse} from "../model/search-response";

@Component({
	templateUrl: './products.component.html',
	styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {

	searchResponse: SearchResponse = new SearchResponse;
	value = value;

	constructor(private searchService: SearchService) {

	}

	ngOnInit(): void {
		this.searchService.search()
			.subscribe((products: any) => this.searchResponse = products);
	}

}
