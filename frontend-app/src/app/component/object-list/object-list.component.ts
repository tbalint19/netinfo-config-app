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
import {RenderElements} from "../../model/render-elements.enum";


@Component({
  selector: 'object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements OnInit {

  structure: any;
  primitives: any[];
  complexStructures: any[];
  filteredList: OsccObject[] = [];


  constructor(
    public _status: ObjectEditorStatus,
    public namespaceStatus: NamespaceStatus,
    public versionStatus: VersionStatus,
    public structureStatus: StructureStatus,
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
    this._service.getObjects(this._status.params).subscribe(
      (response: OsccObject[]) => this.handleGetObjectsResponse(response)
    );
  }

  private getVersionOfTypes(): void {
    this._structureService.getStructures(this.structureStatus.params).subscribe(
      (response: VersionOfType[]) => this.handleGetStructuresResponse(response)
    );
  }

  private monitor(): void {
    this._status.shouldReFetch.subscribe(should => {

      if (should && this.namespaceStatus.chosenNamespace && this.versionStatus.chosenVersion) {
        this._status.setReFetch(false);
        this.structureStatus.params.namespaceId = this.namespaceStatus.chosenNamespace.systemId;
        this._status.params.namespaceSystemId = this.namespaceStatus.chosenNamespace.systemId;
        this.structureStatus.params.versionId = this.versionStatus.chosenVersion.systemId;
        this._status.params.versionSystemId = this.versionStatus.chosenVersion.systemId;
        this.getObjects();
        this.getVersionOfTypes();
      }
    })
  }

  private handleGetObjectsResponse(response: OsccObject[]) {
    this._status.objects = response.sort((one: OsccObject, other: OsccObject) => one['id'] > other['id'] ? 1 : -1);
    this.search(null, null)
  }

  private handleGetStructuresResponse(response: VersionOfType[]) {
    this._status.versionOfTypes = response;
  }

  objectStructures() {
    return this._status.versionOfTypes.filter(entry => entry.type.complex)
      .sort((one: VersionOfType, other: VersionOfType) => one.type.systemId > other.type.systemId ? -1 : 1
      )
  }

  chooseVersionOfType(versionOfType: VersionOfType): void {
    this._status.chosenVersionOfType = versionOfType;
    this.resetSearch();
    this.search(null, null)
  }

  filteredObjects(): OsccObject[] {
     return this._status.chosenVersionOfType ? this._status.objects.filter(
      entry => entry.versionOfType.systemId == this._status.chosenVersionOfType.systemId) : [];
  }

  deleteObject(object: OsccObject): void {
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

  openEditor(object?: OsccObject): void {
    this._status.creator = this._creatorFactory.createObjectCreator(object);
    this._status.restriction = object ? ObjectEditRestriction.UPDATE : ObjectEditRestriction.CREATE;
    this._status.toggleEditor(true);
  }

  private remove(list: any[], element: any): any[] {
    return list.filter((entry) => entry != element);
  }

  private handleDeleteResponse(response: SuccessResponse): void {
    if (response.successful) {
      this._messages.add(new Success('Successful', 'Delete is completed'));
      this._status.setReFetch(true);
    } else {
      this._messages.add(new Error());
    }
  }

  render(rootObject: OsccObject): void {
    this._service.requestPreRenderData(rootObject).subscribe(
      (dto: PreRenderDTO) => {
        this.renderer.initialize(dto.objects, dto.versionOfTypes);
        this.renderer.renderAndDownload(rootObject);
      }
    );
  }

  isActive(versionOfType: VersionOfType): string {
    return this._status.chosenVersionOfType && this._status.chosenVersionOfType.type.systemId == versionOfType.type.systemId ? 'btn-info' : 'btn-default'
  }

  chevronDirection(versionOfType: VersionOfType): string {
    return this._status.chosenVersionOfType && this._status.chosenVersionOfType.type.systemId == versionOfType.type.systemId? 'right' : 'left'
  }

  search(value: string, param: any): void {
    if (value == null ||  param == null) {
      this.filteredList = this.filteredObjects();
    } else {
      if (param == "Id") {
        this.filteredList = this.filteredObjects().filter(entry => entry['id'].indexOf(value) > -1)
      }
      else {
        this.filteredList = this.filteredObjects().filter(entry => {
          return JSON.stringify(JSON.parse(entry.serializedData)[param]).indexOf(value) > -1
        })
      }
    }
    this.stopAnimation()
  }

  reset(): void {
    this.addAnimation();
    this._status.chosenSearchParam = null;
    this._status.searchValue = null;
    this.search(null, null)
  }

  resetSearch(): void {
    this._status.chosenSearchParam = null;
    this._status.searchValue = null;
  }

  structureKeys(): string[] {
    this.structure = JSON.parse(this._status.chosenVersionOfType.structure);
    this.structure = this.structure[Object.keys(this.structure)[0]];
    this.primitives = this.getPrimitives();
    this.complexStructures = this._status.versionOfTypes.filter(
      (entry) => !entry.type.complex
    ).map((entry) => JSON.parse(entry.structure));
    return Object.keys(this.structure);
  }

  parseValue(key: string): string {
    return key.split(" ---> ")[0];
  }

  private getPrimitives(): any[] {
    return [
      {"string": RenderElements.TEXT_INPUT},
      {"number": RenderElements.NUMBER_INPUT},
      {"boolean": RenderElements.CHECK_BOX},
      {"list": RenderElements.SELECT_LIST}
    ]
  }

  isObjectList(key: string): boolean {
    let listName = key.split("-")[1];
    return this.primitives.filter(
      entry => entry.hasOwnProperty(listName)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(listName)
    )[0][listName] == RenderElements.SELECT_LIST;
  }

  isComplex(key: string): boolean {
    return this.complexStructures.filter(
      entry => entry.hasOwnProperty(key)
    ).length == 1;
  }

  private addAnimation(): void {
    document.getElementById('list-spinner').classList.add("spinning-animation")
  }

  private stopAnimation(): void {
    setTimeout(() => {
      if (document.getElementById('list-spinner') && document.getElementById('list-spinner').classList.contains("spinning-animation")) {
        document.getElementById('list-spinner').classList.remove("spinning-animation")
      }
    }, 500)
  }
}
