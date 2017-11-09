import { Component, OnInit } from '@angular/core';
import {ObjectEditorStatus} from "../../status/object-editor-status";
import {NamespaceStatus} from "../../status/namespace-status";
import {VersionStatus} from "../../status/version-status";
import {ObjectService} from "../../service/object.service";
import {Object} from "../../model/object-model";
import {StructureService} from "../../service/structure.service";
import {StructureStatus} from "../../status/structure-status";
import {VersionOfType} from "../../model/version-of-type.model";

@Component({
  selector: 'object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements OnInit {

  constructor(
    protected status: ObjectEditorStatus,
    protected namespaceStatus: NamespaceStatus,
    protected versionStatus: VersionStatus,
    protected structureStatus: StructureStatus,
    private _structureService: StructureService,
    private _service: ObjectService) { }

  ngOnInit() {
    this.monitor();
  }

  private getObjects(): void {
    this._service.getObjects(this.status.params).subscribe(
      (response: Object[]) => this.handleGetResponse(response)
    );
  }

  private getVersionOfTypes(): void {
    this._structureService.getStructures(this.structureStatus.params).subscribe(
      (response: VersionOfType[]) => console.log(response)
    );
  }

  private monitor(): void {
    setInterval(() => {
      if (this.status.shouldReFetch()) {
        this.status.setReFetch(false);
        this.structureStatus.params.namespaceId = this.namespaceStatus.chosenNamespace.systemId;
        this.structureStatus.params.versionId = this.versionStatus.chosenVersion.systemId;
        this.status.params.versionSystemId = this.versionStatus.chosenVersion.systemId;
        this.status.params.namespaceSystemId = this.namespaceStatus.chosenNamespace.systemId;
        this.getObjects();
        this.getVersionOfTypes();
      }
    }, 500)
  }

  private handleGetResponse(response: Object[]) {
    this.status.objects = response;
    console.log(response);
  }
}
