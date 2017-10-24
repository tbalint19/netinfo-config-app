import { Component, OnInit } from '@angular/core';
import {SignupService} from '../../service/signup.service';
import {SignupUser} from '../../model/post-request/signup-user.model';
import {SuccessResponse} from '../../model/response/success-response.model';
import {LoginUser} from '../../model/post-request/login-user.model';
import {LoginService} from '../../service/login.service';
import {TokenResponse} from '../../model/response/token-response';
import {Router} from '@angular/router';
import {ResetService} from "../../service/reset.service";
import {MessageService} from "../../service/message.service";
import {Message} from "../../model/message.model";
import {SignupStatus} from "../../status/signup-status";
import {ResetEmailParams} from "../../model/get-request/reset-email-params.model";
import {CheckUsernameParams} from "../../model/get-request/check-username-params.model";
import {CheckResponse} from "../../model/response/check-response.model";
import {CheckEmailParams} from "../../model/get-request/check-email-params.model";
import {LoginStatus} from "../../status/login-status";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  public signupUser: SignupUser;
  public loginUser: LoginUser;

  constructor(
    protected signupStatus: SignupStatus,
    protected loginStatus: LoginStatus) {
    this.loginUser = new LoginUser();
    this.signupUser = new SignupUser();
    this.signupStatus.setUser(this.signupUser);
    this.loginStatus.setUser(this.loginUser);
  }

  ngOnInit() {
  }
}
