import {VersionOfType} from "./version-of-type.model";

export class ObjectCreator {

  public systemId?: number;

  public data: any;

  public versionOfType: VersionOfType;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.data = {};
    this.versionOfType = null;
  }

  public reset(): void {
    this.initialize();
  }
}