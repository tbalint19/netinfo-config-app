import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'input-info',
  templateUrl: './input-info.component.html',
  styleUrls: ['./input-info.component.css']
})
export class InputInfoComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  type: string;

  @Input()
  text: string;

}
