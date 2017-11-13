import { Component, OnInit } from '@angular/core';
import {StructureStatus} from "../../status/structure-status";

@Component({
  selector: 'structure-refactor',
  templateUrl: './structure-refactor.component.html',
  styleUrls: ['./structure-refactor.component.css']
})
export class StructureRefactorComponent implements OnInit {

  constructor(
    private _status: StructureStatus) { }

  ngOnInit() {
  }

}
