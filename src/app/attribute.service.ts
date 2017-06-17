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
import {Attribute} from "./model/Attribute";

@Injectable()
export class AttributeService {
	constructor(protected http: HttpApi) {

	}

	getAttributes() {
		return this.http.get("/attribute")
			.map((resp: Response) => Attribute.fromJsons(resp.json()));
	}
	addAttribute(attribute: Attribute) {
		return this.http.post("/attribute", JSON.stringify(attribute))
			.map((resp:Response) => Attribute.fromJson(resp.json()));
	}
	changeAttribute(attribute: Attribute) {
		return this.http.put(`/attribute/${attribute.id}`, JSON.stringify(attribute))
			.map((resp:Response) => Attribute.fromJson(resp.json()));
	}
	deleteAttribute(attributeId: number) {
		return this.http.delete(`/attribute/${attributeId}`);
	}

}