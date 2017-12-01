import { Component, OnInit } from '@angular/core';
import {ObjectEditorStatus} from "../../status/object-editor-status";
import {NamespaceStatus} from "../../status/namespace-status";
import {VersionStatus} from "../../status/version-status";
import {ObjectService} from "../../service/object.service";
import {OsccObject} from "../../model/object-model";
import {StructureService} from "../../service/structure.service";
import {StructureStatus} from "../../status/structure-status";
import {VersionOfType} from "../../model/version-of-type.model";
import {CreatorFactory} from "../../factory/creator-factory.service";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Success} from "../../model/message/success.model";
import {Error} from "../../model/message/error.model";
import {ObjectEditRestriction} from "../../model/enums/object-edit-restriction.enum";
import {RenderService} from "../../service/render.service";
import {PreRenderDTO} from "../../model/get-request/pre-render-dto";


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
    private renderer: RenderService,
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
      if (this.status.shouldReFetch() && this.namespaceStatus.chosenNamespace && this.versionStatus.chosenVersion) {
        this.status.setReFetch(false);
        this.structureStatus.params.namespaceId = this.namespaceStatus.chosenNamespace.systemId;
        this.status.params.namespaceSystemId = this.namespaceStatus.chosenNamespace.systemId;
        this.structureStatus.params.versionId = this.versionStatus.chosenVersion.systemId;
        this.status.params.versionSystemId = this.versionStatus.chosenVersion.systemId;
        this.getObjects();
        this.getVersionOfTypes();
      }
    }, 500);
  }

  private handleGetObjectsResponse(response: OsccObject[]) {
    this.status.objects = response.sort((one: OsccObject, other: OsccObject) => one['id'] > other['id'] ? 1 : -1)
        // let a = "lajos";
        // let b = "bela";
        // let c = "923kazmer";
        // let d = "2354";
        // let e = "3245";
        // console.log('diff:ab ',a > b);
        // console.log('diff:ac ',a > c);
        // console.log('diff:cd ',c < d);
        // console.log('diff:ed ',e < d);
        // let sortedListOfTwo = [one.Id, other.Id].sort();
        // return sortedListOfTwo.indexOf(one.Id) > sortedListOfTwo.indexOf(other.Id) ? 1 : -1;
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

  protected deleteObject(object: OsccObject): void {
    let orderInBundle = this.versionStatus.chosenVersion.orderInBundle;
    this._service.preDelete(object['id'], orderInBundle).subscribe(
      (response: OsccObject[]) => {
        let objectsToDelete = [];
        let objectsToUpdate = [];
        for (let obj of response){
          if (!(obj['Id'] == object.Id)){
            let data = JSON.parse(obj.serializedData);
            for (let key of Object.keys(data)){
              if (Array.isArray(data[key])){
                data[key] = this.remove(data[key], object.Id);
              }
            }
            obj.serializedData = JSON.stringify(data);
            objectsToUpdate.push(obj);
          } else {
            objectsToDelete.push(obj);
          }
        }
        this._service.deleteObjects(objectsToDelete, objectsToUpdate).subscribe(
          (response: SuccessResponse) => this.handleDeleteResponse(response)
        )
      }
    );
  }

  protected openEditor(object?: OsccObject): void {
    this.status.creator = this._creatorFactory.createObjectCreator(object);
    this.status.restriction = object ? ObjectEditRestriction.UPDATE : ObjectEditRestriction.CREATE;
    this.status.toggleEditor(true);
  }

  private remove(list: any[], element: any): any[] {
    return list.filter((entry) => entry != element);
  }

  private handleDeleteResponse(response: SuccessResponse): void {
    if (response.successful) {
      this._messages.add(new Success('Successful', 'Delete is completed'));
      this.status.setReFetch(true);
    } else {
      this._messages.add(new Error());
    }
  }

  protected render(rootObject: OsccObject): void {
    this._service.requestPreRenderData(rootObject).subscribe(
      (dto: PreRenderDTO) => {
        this.renderer.initialize(dto.objects, dto.versionOfTypes);
        this.renderer.renderAndDownload(rootObject);
      }
    );
  }

  protected isActive(versionOfType: VersionOfType): string {
    return this.status.chosenVersionOfType && this.status.chosenVersionOfType.type.systemId == versionOfType.type.systemId ? 'btn-info' : 'btn-default'
  }

  protected chevronDirection(versionOfType: VersionOfType): string {
    return this.status.chosenVersionOfType && this.status.chosenVersionOfType.type.systemId == versionOfType.type.systemId? 'right' : 'left'
  }
}
