import { Injectable } from '@angular/core';
import {RequestFactory} from "../factory/request-factory";
import {Observable} from "rxjs/Observable";
import {OsccObject} from "../model/object-model";
import {HttpClient} from "../http/http.client";
import {ObjectParams} from "../model/get-request/object-params.model";
import {ObjectCreateDto} from "../model/post-request/object-create-dto.model";
import {SuccessResponse} from "../model/response/success-response.model";
import {PreUpdateObjectsParams} from "../model/get-request/pre-update-objects-params";
import {VersionOfTypeWithIds} from "../model/response/version-of-type-with-ids";
import {PreUpdateObjectsResponse} from "../model/response/pre-update-objects-response";
import {PreRenderDTO} from "../model/get-request/pre-render-dto";

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

  public preFetchForUpdate(params: PreUpdateObjectsParams): Observable<PreUpdateObjectsResponse> {
    return this._client.transfer(this._factory.createPreUpdateObjectsRequest(params));
  }

  public updateObjects(objects: OsccObject[]): Observable<SuccessResponse> {
    return this._client.transfer(this._factory.createUpdateObjectRequest(objects));
  }

  public deleteObjects(toDelete: OsccObject[], toUpdate: OsccObject[]): Observable<SuccessResponse> {
    return this._client.transfer(this._factory.createDeleteObjectRequest(toDelete, toUpdate));
  }

  public preDelete(id: string, versionId: number): Observable<OsccObject[]> {
    return this._client.transfer(this._factory.createPreDeleteObjectRequest(id, versionId));
  }

  public requestPreRenderData(obj: OsccObject): Observable<PreRenderDTO> {
    let versionId = obj.versionOfType.version.systemId;
    let namespaceId = obj.versionOfType.type.namespace.systemId;
    return this._client.transfer(
      this._factory.createPreRenderRequest({versionId, namespaceId}));
  }
}
