import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeyPipe implements PipeTransform {

  transform(obj: any, args?: any): any {
    let keys = [];
    for (let key in obj) {
      console.log(key);
      keys.push(key);
    }
    return keys;
  }

}