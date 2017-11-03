import { Injectable } from '@angular/core';
import {HttpClient} from "../http/http.client";
import {Observable} from "rxjs/Observable";
import {Namespace} from "../model/namespace.model";
import {HttpRequest} from "../model/http-request.model";
import {RequestFactory} from "../factory/request-factory";
import {SuccessResponse} from "../model/response/success-response.model";

@Injectable()
export class NamespaceService {

  constructor(private _client: HttpClient, private _factory: RequestFactory) { }

  public getNamespaces(): Observable<Namespace[]> {
      return this._client.transfer(this._factory.createGetNamespacesRequest());
  }

  public createNamespace(namespace: Namespace): Observable<SuccessResponse> {
      return this._client.transfer(this._factory.createNamespaceCreateRequest(namespace));
  }

}
