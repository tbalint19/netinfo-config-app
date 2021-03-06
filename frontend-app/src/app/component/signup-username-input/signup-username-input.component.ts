import {Component, Input, OnInit} from '@angular/core';
import {SignupStatus} from "../../status/signup-status";
import {CheckUsernameParams} from "../../model/get-request/check-username-params.model";
import {CheckResponse} from "../../model/response/check-response.model";
import {SignupService} from "../../service/signup.service";
import {SignupUser} from "../../model/post-request/signup-user.model";

@Component({
  selector: 'signup-username-input',
  templateUrl: './signup-username-input.component.html',
  styleUrls: ['./signup-username-input.component.css']
})
export class SignupUsernameInputComponent implements OnInit {

  public user: SignupUser;

  constructor(private service: SignupService, public _status: SignupStatus) {
    this.user = this._status.user;
  }

  ngOnInit() {
  }

  checkUsername(): void {
    if (!this._status.usernameIsValid()){ return; }
    this.service.checkUsername(new CheckUsernameParams(this.user.username))
      .subscribe((response: CheckResponse) => this.handleResponse(response));
  }

  private handleResponse(response: CheckResponse): void {
    this._status.setUsernameAvailability(response.available);
  }

}
