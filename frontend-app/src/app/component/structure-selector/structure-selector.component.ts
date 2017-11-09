import {Component, Input, OnInit} from '@angular/core';
import {StructureStatus} from "../../status/structure-status";

@Component({
  selector: 'structure-selector',
  templateUrl: './structure-selector.component.html',
  styleUrls: ['./structure-selector.component.css']
})
export class StructureSelectorComponent implements OnInit {

  constructor(protected status: StructureStatus) { }

  ngOnInit() {
  }

  @Input()
  public structure: any;

  @Input()
  public type: string;

  protected getName(obj: any){
      return Object.keys(obj)[0];
  }

  public activate(): void {
    this.status.editedStructure = this.structure;
    this.status.toggleEditor(true);
  }

}
