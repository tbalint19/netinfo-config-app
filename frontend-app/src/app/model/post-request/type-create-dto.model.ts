import {Type} from "../type.model";

export class TypeCreateDto {

  public type: Type;

  public namespaceId: number;

  public structure: string;


  constructor() {
    this.initialize();
  }

  public reset(): void {
    this.initialize();
  }

  private initialize(): void {
    this.type = new Type();
    this.namespaceId = null;
    this.structure = '';
  }
}