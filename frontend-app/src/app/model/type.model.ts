import {Namespace} from "./namespace.model";

export class Type {

  systemId: number;

  name: string;

  complex: boolean;

  namespace: Namespace;

  constructor() {
    this.initialize();
  }

  public reset(): void {
    this.initialize();
  }

  private initialize(): void {
    this.systemId = null;
    this.name = '';
    this.complex = false;
    this.namespace = null;
  }
}