import {Component, OnInit} from '@angular/core';
import {SignupStatus} from "../../status/signup-status";
import {CheckEmailParams} from "../../model/get-request/check-email-params.model";
import {CheckResponse} from "../../model/response/check-response.model";
import {SignupService} from "../../service/signup.service";
import {SignupUser} from "../../model/post-request/signup-user.model";

@Component({
  selector: 'signup-email-input',
  templateUrl: './signup-email-input.component.html',
  styleUrls: ['./signup-email-input.component.css']
})
export class SignupEmailInputComponent implements OnInit {

  public user: SignupUser;

  constructor(private service: SignupService, public _status: SignupStatus) {
    this.user = this._status.user;
  }

  ngOnInit() {
  }

  checkEmail(): void {
    if (!this._status.emailIsValid()){ return; }
    this.service.checkEmail(new CheckEmailParams(this.user.email))
      .subscribe((response: CheckResponse) => this.handleResponse(response));
  }

  public handleResponse(response: CheckResponse): void {
    this._status.setEmailAvailability(response.available);
  }

}
