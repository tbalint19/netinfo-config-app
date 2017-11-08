import {Type} from "./type.model";

export class StructureCreator {

  public isCommon: boolean;

  public type: Type;

  public structure: any;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.isCommon = false;
    this.type = new Type;
    this.structure = {};
  }

  public reset(): void {
    this.initialize();
  }
}