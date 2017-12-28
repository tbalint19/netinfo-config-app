import {Component, Input, OnInit} from '@angular/core';
import {SignupStatus} from "../../status/signup-status";
import {SuccessResponse} from "../../model/response/success-response.model";
import {SignupService} from "../../service/signup.service";
import {MessageService} from "../../service/message.service";
import {Error} from "../../model/message/error.model";
import {Success} from "../../model/message/success.model";
import {SignupUser} from "../../model/post-request/signup-user.model";

@Component({
  selector: 'signup-button',
  templateUrl: './signup-button.component.html',
  styleUrls: ['./signup-button.component.css']
})
export class SignupButtonComponent implements OnInit {

  public user: SignupUser;

  constructor(
    private service: SignupService,
    public messages: MessageService,
    public _status: SignupStatus) {
    this.user = this._status.user;
  }

  ngOnInit() {
  }

  public attemptSignup(): void {
    if (!this._status.isPossible()) {
      this.suspend();
      return;
    }
    this.service.attemptSignup(this.user).subscribe(
      (response: SuccessResponse) => this.handleSignupResponse(response.successful)
    );
  }

  private suspend(): void {
    this._status.setSuspended(true);
    this.messages.add(new Error("Error", "Invalid signup data"));
    setTimeout(()=>{
      this._status.setSuspended(false);
    }, 5000);
  }

  private handleSignupResponse(successful: boolean): void {
    if (successful) {
      this.messages.add(new Success("Successful signup", "You can log in now"));
      this._status.user.reset();
    } else {
      this.messages.add(new Error("Ooops!", "Something went wrong"));
    }
  }

}
