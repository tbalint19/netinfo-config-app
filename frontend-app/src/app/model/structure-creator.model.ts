import {Type} from "./type.model";

export class StructureCreator {

  public systemId: number;

  public isCommon: boolean;

  public type: Type;

  public structure: any;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.systemId = null;
    this.isCommon = false;
    this.type = new Type();
    this.structure = {};
  }

  public reset(): void {
    this.initialize();
  }
}