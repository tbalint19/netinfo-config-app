import { Injectable } from '@angular/core';

@Injectable()
export class ObjectValidator {

  constructor() { }

  public dataIsValid(id: string): boolean {
    return typeof id !== 'undefined' && id.length > 3;
  }

}
