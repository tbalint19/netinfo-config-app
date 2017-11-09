import { Injectable } from '@angular/core';
import {RequestFactory} from "../factory/request-factory";
import {Observable} from "rxjs/Observable";
import {Object} from "../model/object-model";
import {HttpClient} from "../http/http.client";
import {ObjectParams} from "../model/get-request/object-params.model";

@Injectable()
export class ObjectService {

  constructor(
    private _client: HttpClient,
    private _factory: RequestFactory) { }


  public getObjects(params: ObjectParams): Observable<Object[]> {
    return this._client.transfer(this._factory.createGetObjectsRequest(params));
  }
}
