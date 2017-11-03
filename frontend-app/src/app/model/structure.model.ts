import {RenderElements} from "./render-elements.enum";

export class Structure {

  public primitiveStrucutres: any;
  public complexStructures: any;
  public objectStructures: any;

  constructor(){
    this.primitiveStrucutres = [
      {"string": RenderElements.TEXT_INPUT},
      {"number": RenderElements.NUMBER_INPUT},
      {"boolean": RenderElements.CHECK_BOX},
      {"list": RenderElements.SELECT_LIST}
    ];
    this.complexStructures = [
      {"mulitlanguage": {"eng": "string", "hun": "string"}},
      {"psmcodes": {"activation": "string", "deactivation": "string"}}
    ];
    this.objectStructures = [
      {"offer": {
        "id": "string",
        "active": "boolean",
        "price": "number",
        "name": "multilanguage",
        "ugrade_offer_ids": "offer-list"
        }
      }
    ];
  }

}