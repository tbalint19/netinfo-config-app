import {Injectable} from "@angular/core";
import {RenderElements} from "../model/render-elements.enum";
import {StructureParams} from "../model/get-request/structure-params.model";

@Injectable()
export class StructureStatus {

  private _open: boolean;
  private _editorActive: boolean;
  public primitiveStrucutres: any;
  public complexStructures: any;
  public objectStructures: any;
  public structure: any;
  public editedStructure: any;
  public params: StructureParams;

  constructor(){
    this.editedStructure = null;
    this.params = new StructureParams();
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

  public isActive(): boolean {
    return this._editorActive;
  }

  public activateEditor(): void {
    this._editorActive = true;
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