import {Injectable} from "@angular/core";

@Injectable()
export class VersionValidator {

  private versionNamePattern: RegExp;
  private versionNumberPattern: RegExp;
  private orderInBundleMinValue: number;

  constructor(){
    this.versionNamePattern = /^([a-zA-Z0-9_. -]){5,25}$/;
    this.versionNumberPattern = /^([a-zA-Z0-9_. -]){5,25}$/;
    this.orderInBundleMinValue = 0;
  }

  public nameIsValid(name: string): boolean {
    return name && name.match(this.versionNamePattern) != null;
  }

  public numberIsValid(number: string): boolean {
    return number && number.match(this.versionNumberPattern) != null;
  }

  public orderInBundleIsValid(orderInBundle: number): boolean {
    return orderInBundle && orderInBundle > this.orderInBundleMinValue;
  }
}



// -datavalidator -id exist -> hossza legalább 3 save, ha
