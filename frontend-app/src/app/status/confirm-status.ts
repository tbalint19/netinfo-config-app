import {Injectable} from "@angular/core";
import {Confirmation} from "../model/post-request/confirmation.model";
import {ConfirmCodeValidator} from "../validator/confirm-code-validator";
import {CredentialValidator} from "../validator/credential-validator";
import {HttpClient} from "../http/http.client";
import {RequestFactory} from "../factory/request-factory";
import {ConfirmEmailParams} from "../model/get-request/confirm-email-params.model";

@Injectable()
export class ConfirmStatus {

  public params: ConfirmEmailParams;
  public confirmation: Confirmation;
  private _suspended: boolean;

  constructor(
    private _confirmCodeValidator: ConfirmCodeValidator,
    private _credentialValidator: CredentialValidator,
    private _requestObserver: HttpClient,
    private _factory: RequestFactory){
    this.confirmation = new Confirmation();
    this.params = new ConfirmEmailParams();
  }

  public setSuspended(isSuspended: boolean): void {
    this._suspended = isSuspended;
  }

  public codeIsValid(): boolean {
    return this._confirmCodeValidator.validFormat(this.confirmation.code);
  }

  public credentialIsValid(): boolean {
    return this._credentialValidator.validFormat(this.confirmation.credential);
  }

  public isPending(): boolean {
    return this._requestObserver.findPending(
      this._factory.createConfirmRequest(this.confirmation));
  }

  public isSuspended(): boolean {
    return this._suspended;
  }

  public isPossible(): boolean {
    return this.codeIsValid() && this.credentialIsValid();
  }
}
