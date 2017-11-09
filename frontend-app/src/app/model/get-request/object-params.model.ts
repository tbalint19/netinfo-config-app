export class ObjectParams {

  namespaceSystemId: number;

  versionSystemId: number;


  constructor() {
    this.initialize();
  }

  private initialize() {
    this.namespaceSystemId = null;
    this.versionSystemId = null;
  }

  reset() {
    this.initialize();
  }
}