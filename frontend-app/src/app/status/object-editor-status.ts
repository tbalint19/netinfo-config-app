import {Injectable} from "@angular/core";

@Injectable()
export class ObjectEditorStatus {

  public currentStructure: any;

  constructor(){
    this.setStructure();
  }

  public setStructure(): void {
    this.currentStructure = {
      "id": "string",
      "active": "boolean",
      "price": "number",
      "name": "multilanguage",
      "ugrade_offer_ids": "offer-list"
    };
  }

}