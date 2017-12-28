import {Component, Input, OnInit} from '@angular/core';
import {StructureStatus} from "../../status/structure-status";
import {StructureService} from "../../service/structure.service";
import {VersionOfType} from "../../model/version-of-type.model";
import {VersionStatus} from "../../status/version-status";
import {NamespaceStatus} from "../../status/namespace-status";
import {PopupStatus} from "../../status/popup-status";

@Component({
  selector: 'structure-popup',
  templateUrl: './structure-popup.component.html',
  styleUrls: ['./structure-popup.component.css']
})
export class StructurePopupComponent implements OnInit {

  constructor(
    public _status: PopupStatus,
    public versionStatus: VersionStatus,
    public namespaceStatus: NamespaceStatus,
    private _structureStatus: StructureStatus) {
  }

  ngOnInit() {
  }

  openPopup(): void {
    this._structureStatus.initialize();
    this._status.toggle(true);
  }

  closePopup(): void {
    document.getElementById("creator").classList.add("slideaway");
    document.getElementById("background").classList.add("disappear");
    setTimeout(()=>{
      this._status.toggle(false);
    }, 500);
  }

}
