import { Injectable } from '@angular/core';
import {RequestFactory} from "../factory/request-factory";
import {Observable} from "rxjs/Observable";
import {OsccObject} from "../model/object-model";
import {HttpClient} from "../http/http.client";
import {ObjectParams} from "../model/get-request/object-params.model";
import {ObjectCreateDto} from "../model/post-request/object-create-dto.model";
import {SuccessResponse} from "../model/response/success-response.model";

@Injectable()
export class ObjectService {

  constructor(
    private _client: HttpClient,
    private _factory: RequestFactory) { }


  public getObjects(params: ObjectParams): Observable<OsccObject[]> {
    return this._client.transfer(this._factory.createGetObjectsRequest(params));
  }

  public saveObjects(dto: ObjectCreateDto): Observable<SuccessResponse> {
    return this._client.transfer(this._factory.createSaveObjectsRequest(dto));
  }

  public updateObjects(object: OsccObject): Observable<SuccessResponse> {
    return this._client.transfer(this._factory.createUpdateObjectRequest(object));
  }

  public deleteObjects(object: OsccObject): Observable<SuccessResponse> {
    return this._client.transfer(this._factory.createDeleteObjectRequest(object));
  }
}
