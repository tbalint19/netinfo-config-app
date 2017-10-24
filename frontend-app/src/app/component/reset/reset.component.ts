import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Reset} from "../../model/post-request/reset.model";
import {Location} from '@angular/common';
import {ResetService} from "../../service/reset.service";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Message} from "../../model/message.model";

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  public reset: Reset;

  constructor(
    private resetService: ResetService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private messages: MessageService,
    private location: Location) {
    this.reset = new Reset();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params['code'] && params['user']) {
          this.initResetFromParams(params);
        } else {
          this.router.navigate(['']);
        }
      }
    );
  }

  public initResetFromParams(params: Params): void {
    this.reset.username = params['user'];
    this.reset.code = params['code'];
    this.location.replaceState("reset");
  }

  public attemptReset(): void {
    this.resetService.attemptReset(this.reset).subscribe(
      (response: SuccessResponse) => this.handleResetResponse(response.successful),
      (error) => console.log(error),
      () => console.log("Reset attempt finished")
    )
  }

  private handleResetResponse(successful: boolean): void {
    if (successful) {
      this.handleSuccess();
    } else {
      this.handleError();
    }
  }

  private handleSuccess(): void {
    this.messages.add(new Message("success", "Successful reset", "You can log in now with your new password"));
    this.router.navigate(['start']);
  }

  private handleError(): void {
    this.messages.add(new Message("error", "Error", "Unsuccessful password reset attempt"));
  }

}
