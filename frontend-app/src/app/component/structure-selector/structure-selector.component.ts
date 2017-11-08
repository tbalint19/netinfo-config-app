import {Component, Input, OnInit} from '@angular/core';
import {StructureStatus} from "../../status/structure-status";

@Component({
  selector: 'structure-selector',
  templateUrl: './structure-selector.component.html',
  styleUrls: ['./structure-selector.component.css']
})
export class StructureSelectorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  public status: StructureStatus;

  @Input()
  public structure: any;

  public activate(): void {
    this.status.editedStructure = this.structure;
    this.status.activateEditor();
  }

}
