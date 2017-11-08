export class NewRow {

  public name: string;

  public value: string;


  constructor() {
    this.initialize();
  }

  private initialize(): void {
    this.name = '';
    this.value = '';
  }

  public reset(): void {
    this.initialize();
  }
}