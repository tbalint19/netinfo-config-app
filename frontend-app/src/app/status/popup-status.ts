import {Injectable} from "@angular/core";

@Injectable()
export class PopupStatus {

  private _open: boolean;

  constructor(){
    this._open = false;
  }

  public isOpen(): boolean {
    return this._open;
  }

  public toggle(to: boolean): void {
    this._open = to;
  }

}