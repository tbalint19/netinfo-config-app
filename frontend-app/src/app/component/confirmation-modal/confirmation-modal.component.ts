import {Component, Input, OnInit} from '@angular/core';
import {ConfirmModalStatus} from "../../status/confirm-modal-status";


@Component({
  selector: 'confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {

  @Input()
  public saveFunction: Function;

  constructor(public _status: ConfirmModalStatus,) {

  }

  ngOnInit() {
  }

  closeModal(): void {
    let modal = document.getElementById("confirm-modal");
    let background = document.getElementById("confirm-modal-background")
    modal.classList.add("my-modal-slide-out");
    background.classList.add("my-modal-background-disappear");
    setTimeout(() => {
      this._status.confirmModalIsShown = false;
      this._status.chosenSelector = null;
    }, 700);
  }

  save(): void {
    this.saveFunction();
    this.closeModal();
  }

  getKeys(object: any): string[] {
    return Object.keys(object);
  }
}
