import { Injectable } from '@angular/core';
import {RequestFactory} from "../factory/request-factory";
import {HttpClient} from "../http/http.client";
import {Observable} from "rxjs/Observable";
import {Version} from "../model/version.model";
import {SuccessResponse} from "../model/response/success-response.model";

@Injectable()
export class VersionService {

  constructor(private _factory: RequestFactory, private _client: HttpClient) { }

  public getVersions(): Observable<Version[]> {
    return this._client.transfer(this._factory.createGetVersionRequest());
  }

  public createVersion(version: Version): Observable<SuccessResponse> {
    return this._client.transfer(this._factory.createVersionCreateRequest(version));
  }

}
