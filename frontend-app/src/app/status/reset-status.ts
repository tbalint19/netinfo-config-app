import {Injectable} from "@angular/core";
import {Reset} from "../model/post-request/reset.model";
import {ResetCodeValidator} from "../validator/reset-code-validator";
import {HttpClient} from "../http/http.client";
import {RequestFactory} from "../factory/request-factory";
import {UsernameValidator} from "../validator/username-validator";
import {PasswordValidator} from "../validator/password-validator";

@Injectable()
export class ResetStatus {

  public reset: Reset;
  private _suspended: boolean;

  constructor(
    private _usernameValidator: UsernameValidator,
    private _codeValidator: ResetCodeValidator,
    private _passwordValidator: PasswordValidator,
    private _requestObserver: HttpClient,
    private _factory: RequestFactory){
    this.reset = new Reset();
  }

  public setSuspended(isSuspended: boolean): void {
    this._suspended = isSuspended;
  }

  public usernameIsValid(): boolean {
    return this._usernameValidator.validFormat(this.reset.username);
  }

  public resetIsValid(): boolean {
    return this._codeValidator.validFormat(this.reset.code);
  }

  public passwordIsValid(): boolean {
    return this._passwordValidator.validFormat(this.reset.password);
  }

  public passwordMatches(): boolean {
    return this.reset.password == this.reset.passwordAgain;
  }

  public isPending(): boolean {
    return this._requestObserver.findPending(this._factory.createResetRequest(this.reset));
  }

  public isPossible(): boolean {
    return this.usernameIsValid() && this.resetIsValid() && this.passwordIsValid() && this.passwordMatches();
  }

  public isSuspended(): boolean {
    return this._suspended;
  }

}
