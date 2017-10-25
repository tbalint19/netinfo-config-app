import {Component, Input, OnInit} from '@angular/core';
import {LoginStatus} from "../../status/login-status";
import {SuccessResponse} from "../../model/response/success-response.model";
import {ResetEmailParams} from "../../model/get-request/reset-email-params.model";
import {ResetService} from "../../service/reset.service";
import {Message} from "../../model/message.model";
import {MessageService} from "../../service/message.service";

@Component({
  selector: 'app-reset-popup',
  templateUrl: './reset-popup.component.html',
  styleUrls: ['./reset-popup.component.css']
})
export class ResetPopupComponent implements OnInit {

  protected params: ResetEmailParams;

  constructor(
    private service: ResetService,
    private messages: MessageService) {
    this.params = new ResetEmailParams();
  }

  ngOnInit() {
  }

  @Input()
  public status: LoginStatus;

  public requestReset(): void {
    this.service.requestReset(this.params).subscribe(
      (response: SuccessResponse) => this.handleResetRequest(response.successful),
    );
  }

  public handleResetRequest(successful: boolean): void {
    if (successful) {
      this.messages.add(new Message("success", "Email sent", "Your mail should arrive in a few seconds"));
    } else {
      this.messages.add(new Message("error", "Invalid credentials", "No email is sent"));
    }
    this.closeReset();
  }

  public closeReset(): void {
    this.status.setResetActive(false);
  }

}