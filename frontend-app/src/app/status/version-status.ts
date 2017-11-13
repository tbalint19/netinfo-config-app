import {Injectable} from "@angular/core";
import {Version} from "../model/version.model";
import {VersionValidator} from "../validator/version-validator";
import {HttpClient} from "../http/http.client";
import {RequestFactory} from "../factory/request-factory";

@Injectable()
export class VersionStatus {

  public versions: Version[];
  public chosenVersion: Version;
  public createdVersion: Version;
  public createdVersionsBaseVersion: Version;

  constructor(
    private _validator: VersionValidator,
    private _requestObserver: HttpClient,
    private _factory: RequestFactory){
    this.versions = [];
    this.createdVersion = new Version();
    this.chosenVersion = null;
    this.createdVersionsBaseVersion = null;
  }

  public nameIsValid(): boolean {
    return this._validator.nameIsValid(this.createdVersion.name);
  }

  public numberIsValid(): boolean {
    return this._validator.numberIsValid(this.createdVersion.number);
  }

  public orderInBundleIsValid(): boolean {
    let byValidator = this._validator.orderInBundleIsValid(this.createdVersion.orderInBundle);
    let byList = this.versions.length == 0 ? this.createdVersion.orderInBundle > 0 : this.createdVersion.orderInBundle > 1;
    return byValidator && byList;
  }

  public dataIsValid(): boolean {
    return this.nameIsValid() && this.numberIsValid() && this.orderInBundleIsValid();
  }

  public isPendingFetch(): boolean {
    return this._requestObserver.findPending(this._factory.createGetVersionRequest());
  }

  public isPendingCreate(): boolean {
    return this._requestObserver.findPending(this._factory.createVersionCreateRequest(this.createdVersion));
  }

  public isSuspended(): boolean {
    return false;
  }
}