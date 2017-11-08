import { Component, OnInit } from '@angular/core';
import {SignupStatus} from "../../status/signup-status";
import {LoginStatus} from "../../status/login-status";

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  constructor(
    protected signupStatus: SignupStatus,
    protected loginStatus: LoginStatus) {
  }

  ngOnInit() {
  }
}
