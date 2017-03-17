/**
 * User: phi
 *  .___.
 *  {o,o}
 * /)___)
 * --"-"--
 */
import {Injectable} from "@angular/core";
import {Http, Headers, Response, RequestOptions, XHRBackend, RequestOptionsArgs, Request} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {GlobalService} from "./global.service";

@Injectable()
export class HttpApi extends Http {
	//private BASE_URI = 'http://localhost:8080';
	private BASE_URI = 'http://85.214.135.29:8080';

	constructor(backend: XHRBackend, options: RequestOptions, private globalService: GlobalService) {
		super(backend, options);
	}

	/** request wrapper: 1. set auth bearer & content-type json. 2. custom error handler. 3. add base_uri+(...) */
	request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
		let currentUser = this.globalService.getCurrentlyLoggedInUser();
		let token = '';
		if (currentUser && currentUser.token) {
			token = currentUser.token;
		}
		if (typeof url === 'string') { // add the token to the options, not in url
			alert("???????????? url is type string"); // todo
			url = `${this.BASE_URI}${url}`;
			options.headers.set('Authorization', `Bearer ${token}`);
		} else {
			url.url = `${this.BASE_URI}${url.url}`;
			url.headers.set('Authorization', `Bearer ${token}`);
		}
		// todo loading animation ..?
		return super.request(url, options)
			.catch(this.catchError(this));
	}

	get(url: string, options?: RequestOptionsArgs): Observable<Response> {
		options = HttpApi.setContentTypeJson(options);
		return super.get(url, options)
	}

	post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
		options = HttpApi.setContentTypeJson(options);
		return super.post(url, body, options)
	}

	put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
		options = HttpApi.setContentTypeJson(options);
		return super.put(url, body, options)
	}

	delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
		options = HttpApi.setContentTypeJson(options);
		return super.delete(url, options)
	}

	patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
		options = HttpApi.setContentTypeJson(options);
		return super.patch(url, body, options)
	}

	options(url: string, options?: RequestOptionsArgs): Observable<Response> {
		options = HttpApi.setContentTypeJson(options);
		return super.options(url, options)
	}

	private catchError(self: HttpApi) {
		return (res: Response) => {
			console.log(res);
			if (res.status === 401 || res.status === 403) {
				// not authd
			} else {
				alert("Server error"); //////todo
			}
			return Observable.throw(res);
		};
	}

	private static setContentTypeJson(options?: RequestOptionsArgs) {
		if (!options) {
			options = new RequestOptions({headers: new Headers()});
		}
		options.headers.set('Content-Type', 'application/json');
		return options;
	}

}