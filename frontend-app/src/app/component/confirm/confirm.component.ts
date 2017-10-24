import { Component, OnInit } from '@angular/core';
import {Confirmation} from '../../model/post-request/confirmation.model';
import {ConfirmService} from '../../service/confirm.service';
import {TokenResponse} from '../../model/response/token-response';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Location} from '@angular/common';
import {MessageService} from "../../service/message.service";
import {Message} from "../../model/message.model";

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

  public confirmation: Confirmation;

  constructor(
    private confirmService: ConfirmService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private messages: MessageService,
    private router: Router) {
    this.confirmation = new Confirmation();
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
      (params: Params) => {
        if (params['code'] && params['user']) {
          this.attemptConfirmFromParams(params);
        } else if (sessionStorage.getItem('credential')) {
          this.initConfirmFromLogin();
        } else {
          this.router.navigate(['start']);
        }
      }
    );
  }

  public attemptConfirmFromParams(params: Params): void {
    this.location.replaceState('confirm');
    this.confirmation.code = params['code'];
    this.confirmation.credential = params['user'];
    this.attemptConfirm();
  }

  public initConfirmFromLogin(): void {
    this.confirmation.credential = sessionStorage.getItem('credential');
    sessionStorage.removeItem('credential');
  }

  public attemptConfirm(): void {
    this.confirmService.attemptConfirm(this.confirmation).subscribe(
      (response: TokenResponse) => this.handleConfirmResponse(response),
      (error) => console.log(error),
      () => console.log('Finished attempt request')
    );
  }

  public handleConfirmResponse(response: TokenResponse): void {
    if (response.token) {
      this.handleSuccessfulConfirm(response.token);
    } else {
      this.handleFailedConfirm();
    }
  }

  private handleSuccessfulConfirm(token: string): void {
    localStorage.setItem('auth-token', token);
    this.messages.add(new Message("success","Successful confirmation" , "Your account is confirmed"))
    this.router.navigate(['']);
  }

  private handleFailedConfirm(): void {
    this.messages.add(new Message("error", "Error", "Unsuccessful confirmation"));
  }

  public resendRequest(): void {

  }

  public getStart(){
    this.router.navigate(['start']);
  }

  public getReason(){
    let cred = this.confirmation.credential;
    if (!cred) {
      return "";
    }
    return cred.includes("@") ? "this account belongs to " + cred : "the account created for " + cred + " is valid"
  }

}
