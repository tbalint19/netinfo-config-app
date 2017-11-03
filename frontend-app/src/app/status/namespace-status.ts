import {Injectable} from "@angular/core";
import {Namespace} from "../model/namespace.model";
import {NamespaceValidator} from "../validator/namespace-validator";
import {HttpClient} from "../http/http.client";
import {RequestFactory} from "../factory/request-factory";

@Injectable()
export class NamespaceStatus {

    public chosenNamespace: Namespace;
    public namespaces: Namespace[];
    public createdNamespace: Namespace;
    private _isSuspended: boolean;

    constructor(
      private _namespaceValidator: NamespaceValidator,
      private _requestObserver: HttpClient,
      private _factory: RequestFactory){
      this.namespaces = [];
      this.createdNamespace = new Namespace();
      this.chosenNamespace = null;
    }

  public isValid(): boolean {
    return this._namespaceValidator.validFormat(this.createdNamespace.name);
  }

  public isAvailable(): boolean {
    return this.namespaces.filter(
      (entry: Namespace) => entry.name == this.createdNamespace.name).length == 0;
  }

  public isSuspended(): boolean {
    return this._isSuspended;
  }

  public isPending(): boolean {
    return this._requestObserver.findPending(
      this._factory.createNamespaceCreateRequest(this.createdNamespace));
  }

  public setSuspended(isSuspended: boolean): void {
    this._isSuspended = isSuspended;
  }

}