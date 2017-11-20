export class NewRow {

  public name: string;

  public value: string;

  public defaultValue: any;


  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.name = '';
    this.value = '';
    this.defaultValue = '';
  }

  public reset(): void {
    this.initialize();
  }
}