import { Component, OnInit } from '@angular/core';
import {ObjectEditorStatus} from "../../status/object-editor-status";
import {NamespaceStatus} from "../../status/namespace-status";
import {VersionStatus} from "../../status/version-status";
import {ObjectService} from "../../service/object.service";
import {OsccObject} from "../../model/object-model";
import {StructureService} from "../../service/structure.service";
import {StructureStatus} from "../../status/structure-status";
import {VersionOfType} from "../../model/version-of-type.model";
import {ObjectCreator} from "../../model/object-creator.model";
import {CreatorFactory} from "../../factory/creator-factory.service";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Success} from "../../model/message/success.model";
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {Error} from "../../model/message/error.model";

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
    private _service: ObjectService,
    private _creatorFactory: CreatorFactory,
    private _messages: MessageService) {
  }

  ngOnInit() {
    this.monitor();
  }

  private getObjects(): void {
    this._service.getObjects(this.status.params).subscribe(
      (response: OsccObject[]) => this.handleGetObjectsResponse(response)
    );
  }

  private getVersionOfTypes(): void {
    this._structureService.getStructures(this.structureStatus.params).subscribe(
      (response: VersionOfType[]) => this.handleGetStructuresResponse(response)
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
    }, 500);
  }

  private handleGetObjectsResponse(response: OsccObject[]) {
    this.status.objects = response;
  }

  private handleGetStructuresResponse(response: VersionOfType[]) {
    this.status.versionOfTypes = response;
  }

  protected objectStructures() {
    return this.status.versionOfTypes.filter(entry => entry.type.complex);
  }

  protected chooseVersionOfType(versionOfType: VersionOfType): void {
    this.status.chosenVersionOfType = versionOfType;
  }

  protected filteredObjects(): OsccObject[] {
    return this.status.objects.filter(
      entry => entry.versionOfType.systemId == this.status.chosenVersionOfType.systemId);
  }

  protected openEditor(object?: OsccObject): void {
    this.status.creator = this._creatorFactory.createObjectCreator(object);
    this.status.toggleEditor(true);
  }

  protected deleteObject(object: OsccObject): void {
    this._service.deleteObjects(object).subscribe(
      (response: SuccessResponse) => this.handleDeleteResponse(response)
    )
  }

  private handleDeleteResponse(response: SuccessResponse): void {
    if (response.successful) {
      this._messages.add(new Success('Successful', 'Delete is completed'));
      this.status.setReFetch(true);
    } else {
      this._messages.add(new Error());
    }
  }
}
