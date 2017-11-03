export class Version {

  public name: string;

  public number: string;

  public orderInBundle: number;

  private initialize(){
    this.name = "";
    this.number = "";
    this.orderInBundle = null;
  }

  constructor(){
    this.initialize();
  }

  reset(): void {
    this.initialize();
  }
}