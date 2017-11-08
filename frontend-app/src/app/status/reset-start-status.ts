import {Injectable} from "@angular/core";
import {HttpClient} from "../http/http.client";
import {RequestFactory} from "../factory/request-factory";
import {CredentialValidator} from "../validator/credential-validator";
import {ResetEmailParams} from "../model/get-request/reset-email-params.model";

@Injectable()
export class ResetStartStatus {

  public params: ResetEmailParams;

  constructor(
    private _validator: CredentialValidator,
    private _requestObserver: HttpClient,
    private _factory: RequestFactory){
    this.params = new ResetEmailParams();
  }

  public credentialIsValid(): boolean {
    return this._validator.validFormat(this.params.credential);
  }

  public isPending(): boolean {
    return this._requestObserver.findPending(
      this._factory.createResetEmailRequest(this.params));
  }

  public isPossible(): boolean {
    return this.credentialIsValid() && !this.isPending();
  }

}
