/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 * 10.03.17
 */
import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
import {HttpApi} from "./http-api.service";
import {Response} from "@angular/http";
import {SearchResponse} from "./model/search-response";

export enum SortingOrder {
	ASC,
	DESC
}

@Injectable()
export class SearchService {
	constructor(protected http: HttpApi) {

	}

	/**
	 * GET RESULTS
	 * 1. filters
	 * 2. sorting attributes
	 * 3. additional show attributes
	 * ///
	 * 4. limit
	 * 5. desired column amount
	 */
	search(filterAttributes: Map<number,string>, sortingAttributes: Map<number, SortingOrder>, showAttributes: Set<number>, rows: number, columns: number) {
		// filter map to "filter1:value1,filter2:value2,..."-string
		let filterQ: string = Array.from(filterAttributes).map(([attributeId, filter]) => `${attributeId}:${filter}`).join(',');
		// same for sorting map
		let sortingQ: string = Array.from(sortingAttributes).map(([attributeId, sortingOrder]) => `${attributeId}:${sortingOrder}`).join(',');
		// show map to "a,b,c,..."-string
		let showingQ: string = Array.from(showAttributes).join(',');
		return this.http.get(`/search?filter=${filterQ}&sorting=${sortingQ}&show=${showingQ}&rows=${rows}&columns=${columns}`)
			.map((resp:Response) => SearchResponse.fromJson(resp.json()));
	}
}