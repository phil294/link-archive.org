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
import {SearchResponse} from "./model/search-response";

@Injectable()
export class SearchService {
	constructor(protected http: HttpApi) {

	}
	search() {
		return this.http.get("/search")
			.map((resp:Response) => SearchResponse.fromJson(resp.json()));
	}
}