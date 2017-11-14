import {Component, Input, OnInit} from '@angular/core';
import {StructureStatus} from "../../status/structure-status";
import {StructureEditRestriction} from "../../model/enums/structure-edit-restriction.enum";

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
  public versionOfType: any;

  @Input()
  public type: string;

  protected getName(obj: any){
      return Object.keys(obj)[0];
  }

  public activate(onlyUpdate: boolean): void {
    this.status.editedStructure = this.versionOfType['structure'];
    let restriction = onlyUpdate ? StructureEditRestriction.UPDATE : StructureEditRestriction.DELETE;
    this.status.toggleEditor(true, this.versionOfType, restriction);
  }

}
