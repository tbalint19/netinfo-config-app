import {Injectable} from "@angular/core";
import {RenderElements} from "../model/render-elements.enum";

@Injectable()
export class StructureStatus {

  private _open: boolean;
  public primitiveStrucutres: any;
  public complexStructures: any;
  public objectStructures: any;
  public structure: any;

  constructor(){
    this.primitiveStrucutres = [
      {"string": RenderElements.TEXT_INPUT},
      {"number": RenderElements.NUMBER_INPUT},
      {"boolean": RenderElements.CHECK_BOX},
      {"list": RenderElements.SELECT_LIST}
    ];
    this.complexStructures = [];
    this.objectStructures = [];
    this.complexStructures.push({"multilanguage": {"eng": "string", "hun": "string"}});
    this.complexStructures.push({"psmcodes": {"activation": "string", "deactivation": "string"}});
    this.objectStructures.push(
      {"offer": {
        "id": "string",
        "active": "boolean",
        "price": "number",
        "name": "multilanguage"
        }
      }
    )
  }

  public isOpen(): boolean {
    return this._open;
  }

  public toggle(to: boolean): void {
    this._open = to;
  }

  public setStructure(): void {
    this.structure = {
      "id": "string",
      "active": "boolean",
      "price": "number",
      "name": "multilanguage",
      "ugrade_offer_ids": "offer-list"
    };
  }

}