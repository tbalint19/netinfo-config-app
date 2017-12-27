import {Directive, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appEnter]'
})
export class EnterDirective {

  constructor() {
  }

  @Input()
  functionToCall: Function;

  @HostListener('keyup', ['$event'])
  onClick(e) {
    if (e.key == 'Enter') {
      this.functionToCall();
    }
  }
}
