import {Injectable} from "@angular/core";
import {Structure} from "../model/structure.model";

@Injectable()
export class StructureStatus {

  private _open: boolean;
  private _structure: Structure;

  constructor(){
    this._structure = new Structure();
  }

  public isOpen(): boolean {
    return this._open;
  }

  public toggle(to: boolean): void {
    this._open = to;
  }

}