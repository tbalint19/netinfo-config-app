import {Component, Input, OnInit} from '@angular/core';
import {SignupUser} from "../../model/post-request/signup-user.model";
import {SignupStatus} from "../../status/signup-status";
import {SuccessResponse} from "../../model/response/success-response.model";
import {SignupService} from "../../service/signup.service";
import {Message} from "../../model/message.model";
import {MessageService} from "../../service/message.service";

@Component({
  selector: 'signup-button',
  templateUrl: './signup-button.component.html',
  styleUrls: ['./signup-button.component.css']
})
export class SignupButtonComponent implements OnInit {

  constructor(private service: SignupService, public messages: MessageService) { }

  ngOnInit() {
  }

  @Input()
  public user: SignupUser;

  @Input()
  public status: SignupStatus;

  public attemptSignup(): void {
    this.service.attemptSignup(this.user).subscribe(
      (response: SuccessResponse) => this.handleSignupResponse(response.successful)
    );
  }

  private handleSignupResponse(successful: boolean): void {
    if (successful) {
      this.messages.add(new Message("success", "Successful signup", "You can log in now"));
      this.user.reset();
    } else {
      this.messages.add(new Message("error", "Ooops!", "Something went wrong"));
    }
  }

}
