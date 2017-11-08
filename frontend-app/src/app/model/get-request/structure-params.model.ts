export class StructureParams {

  namespaceId: number;

  versionId: number;

  initialize(): void {
    this.namespaceId = null;
    this.versionId = null;
  }

  constructor(){
    this.initialize();
  }

  reset(): void {
    this.initialize();
  }
}