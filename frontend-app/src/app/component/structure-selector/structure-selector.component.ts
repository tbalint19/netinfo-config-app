import {Component, Input, OnInit} from '@angular/core';
import {StructureStatus} from "../../status/structure-status";
import {StructureEditRestriction} from "../../model/enums/structure-edit-restriction.enum";

@Component({
  selector: 'structure-selector',
  templateUrl: './structure-selector.component.html',
  styleUrls: ['./structure-selector.component.css']
})
export class StructureSelectorComponent implements OnInit {

  constructor(public _status: StructureStatus) { }

  ngOnInit() {
  }

  @Input()
  public versionOfType: any;

  @Input()
  public type: string;

  getName(obj: any){
      return Object.keys(obj)[0];
  }

  public activate(onlyUpdate: boolean): void {
    this._status.toggleEditor(true, this.versionOfType, onlyUpdate ? StructureEditRestriction.UPDATE : StructureEditRestriction.DELETE);
  }

}
