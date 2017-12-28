import {Component, Input, OnInit} from '@angular/core';
import {SignupStatus} from "../../status/signup-status";
import {SignupUser} from "../../model/post-request/signup-user.model";

@Component({
  selector: 'signup-password-again-input',
  templateUrl: './signup-password-again-input.component.html',
  styleUrls: ['./signup-password-again-input.component.css']
})
export class SignupPasswordAgainInputComponent implements OnInit {

  public user: SignupUser;

  constructor(public _status: SignupStatus) {
    this.user = this._status.user;
  }

  ngOnInit() {
  }

}
