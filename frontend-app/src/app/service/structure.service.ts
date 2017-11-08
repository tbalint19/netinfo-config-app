import { Injectable } from '@angular/core';
import {HttpClient} from "../http/http.client";
import {RequestFactory} from "../factory/request-factory";
import {Observable} from "rxjs/Observable";
import {VersionOfType} from "../model/version-of-type.model";
import {StructureParams} from "../model/get-request/structure-params.model";
import {TypeCreateDto} from "../model/post-request/type-create-dto.model";
import {SuccessResponse} from "../model/response/success-response.model";

@Injectable()
export class StructureService {

  constructor(
    private _client: HttpClient,
    private _factory: RequestFactory) {
  }

  public getStructures(params: StructureParams): Observable<VersionOfType[]> {
    return this._client.transfer(this._factory.createGetStructuresRequest(params));
  }

  public save(dto: TypeCreateDto): Observable<SuccessResponse> {
    return this._client.transfer(this._factory.createStructureCreateRequest(dto));
  }

}
