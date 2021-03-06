export class Version {

  public systemId: number;

  public name: string;

  public number: string;

  public orderInBundle: number;

  private initialize(){
    this.systemId = null;
    this.name = "";
    this.number = "";
    this.orderInBundle = 1;
  }

  constructor(){
    this.initialize();
  }

  reset(): void {
    this.initialize();
  }
}