import { Injectable } from '@angular/core';

@Injectable()
export class StructureValidator {

  private _namePattern: RegExp;
  private _keyPattern: RegExp;

  constructor() {
    this._namePattern = /^([a-zA-Z0-9_-]){4,25}$/;
    this._keyPattern = /^([a-zA-Z0-9_-]){2,25}$/;
  }

  public nameIsValid(name: string): boolean {
    return name && name.match(this._namePattern) != null;
  }

  public keyIsValid(key: string): boolean {
    return key && key.match(this._keyPattern) != null;
  }

  public valueIsValid(value: string): boolean {
    return value != null && value !== undefined && value !== '';
  }

  public notEmpty(object: any): boolean {
    return Object.keys(object).length > 0;
  }

  public nameIsAvailable(name: string, list: any[]): boolean {
    return list.filter((entry) => entry.hasOwnProperty(name)).length == 0;
  }
}
