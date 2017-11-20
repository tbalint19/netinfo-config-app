import { Component, OnInit } from '@angular/core';
import {StructureStatus} from "../../status/structure-status";
import {ObjectEditorStatus} from "../../status/object-editor-status";
import {RenderElements} from "../../model/render-elements.enum";
import {OsccObject} from "../../model/object-model";
import {ObjectCreator} from "../../model/object-creator.model";
import {DtoFactory} from "../../factory/dto-factory";
import {ObjectService} from "../../service/object.service";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Success} from "../../model/message/success.model";
import {Error} from "../../model/message/error.model";
import _ from 'lodash';
import {PreUpdateObjectsParams} from "../../model/get-request/pre-update-objects-params";
import {Observable} from "rxjs/Observable";
import {VersionOfTypeWithIds} from "../../model/response/version-of-type-with-ids";
import {PreUpdateObjectsResponse} from "../../model/response/pre-update-objects-response";
import {ObjectEditRestriction} from "../../model/enums/object-edit-restriction.enum";

@Component({
  selector: 'object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements OnInit {

  protected structure: any;
  protected primitives: any[];
  protected complexStructures: any[];
  protected objectStructures: any[];

  constructor(
    protected status: ObjectEditorStatus,
    private _factory: DtoFactory,
    private _service: ObjectService,
    private _messages: MessageService) { }

  ngOnInit() {
    this.structure = JSON.parse(this.status.chosenVersionOfType.structure);
    this.structure = this.structure[Object.keys(this.structure)[0]];
    this.primitives = this.getPrimitives();
    this.complexStructures = this.status.versionOfTypes.filter(
      (entry) => !entry.type.complex
    ).map((entry) => JSON.parse(entry.structure));
    this.objectStructures = this.status.versionOfTypes.filter(
      (entry) => entry.type.complex
    ).map((entry) => JSON.parse(entry.structure));
    this.createBaseData();
  }

  protected structureKeys(): string[] {
    return Object.keys(this.structure);
  }

  protected updateRestricion(): ObjectEditRestriction {
    return ObjectEditRestriction.UPDATE;
  }


  protected complexTypeKeys(complexTypeName: string): string[] {
    let structure = this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complexTypeName))[0];
    return Object.keys(structure[Object.keys(structure)[0]]);
  }

  protected isText(key: string, complex?: string): boolean {
    let k = complex ? this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complex)
    )[0][complex][key] : key;
    return this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    )[0][k] == RenderElements.TEXT_INPUT;
  }

  protected parseValue(key: string): string {
    return key.split(" ---> ")[0];
  }

  protected getDefaultValue(key: string): string {
    return key.split(" ---> ")[1];
  }

  protected isNumber(key: string, complex?: string): boolean {
    let k = complex ? this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complex)
    )[0][complex][key] : key;
    return this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    )[0][k] == RenderElements.NUMBER_INPUT;
  }

  protected isBoolean(key: string, complex?: string): boolean {
    let k = complex ? this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complex)
    )[0][complex][key] : key;
    return this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    )[0][k] == RenderElements.CHECK_BOX;
  }

  protected isComplex(key: string): boolean {
    return this.complexStructures.filter(
      entry => entry.hasOwnProperty(key)
    ).length == 1;
  }

  protected isObjectList(key: string): boolean {
    let listName = key.split("-")[1];
    return this.primitives.filter(
      entry => entry.hasOwnProperty(listName)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(listName)
    )[0][listName] == RenderElements.SELECT_LIST;
  }

  private createBaseData(): void {
    this.status.creator.versionOfType = this.status.chosenVersionOfType;
    for (let key of this.structureKeys()){
      if (this.isText(this.parseValue(this.structure[key]))) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]) : this.status.creator.data[key];
      }
      if (this.isNumber(this.parseValue(this.structure[key]))) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]): this.status.creator.data[key];
      }
      if (this.isBoolean(this.parseValue(this.structure[key]))) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]) == "true" ? true : false : this.status.creator.data[key];
      }
      if (this.isComplex(this.parseValue(this.structure[key]))) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? {} : this.status.creator.data[key];
      }
      if (this.isObjectList(this.parseValue(this.structure[key]))) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? [] : this.status.creator.data[key];
      }
    }
  }

  protected getObjects(key: string): OsccObject[] {
    return this.status.objects.filter(
      (entry) => entry.versionOfType.type.name == key.split("-")[0]
    )
  }

  protected getIdentification(obj: OsccObject): string {
    return JSON.parse(obj.serializedData)['id'];
  }

  private getPrimitives(): any[] {
    return [
      {"string": RenderElements.TEXT_INPUT},
      {"number": RenderElements.NUMBER_INPUT},
      {"boolean": RenderElements.CHECK_BOX},
      {"list": RenderElements.SELECT_LIST}
    ]
  }

  public saveObject(): void {
    if (this.status.creator.systemId) {
      this.updateObject();
    } else {
      this.createObject();
    }
  }

  private handleCreateResponse(response: SuccessResponse) {
    if (response.successful) {
      this.status.reset();
      this._messages.add(new Success('Success', 'Object created'));
    } else {
      this._messages.add(new Error('Oops', 'Something went wrong'))
    }
  }

  protected isInList(object: OsccObject, key: string): boolean {
    return this.status.creator.data[key].includes(JSON.parse(object.serializedData)['id']);
  }

  toggleList(object: OsccObject, key: string): void {
    let list = this.status.creator.data[key];
    let id = JSON.parse(object.serializedData)['id'];
    if (this.isInList(object, key)) {
      let index = list.indexOf(id);
      this.status.creator.data[key].splice(index, 1);
    } else {
      list.push(id);
    }
  }

  private updateObject(): void {
    this.status.setUpdating(true);
    this.preUpdate().subscribe(
      (response: PreUpdateObjectsResponse) => {
        this.bulkOverWrite(response.objects, response.versionOfTypeWithIds);
        this._service.updateObjects(response.objects).subscribe(
          (response: SuccessResponse) => this.handleUpdateResponse(response)
        );
      }
    );
  }

  private preUpdate(): Observable<PreUpdateObjectsResponse> {
    let params = new PreUpdateObjectsParams();
    params.objectId = this.status.creator.data['id'];
    params.versionSystemId = this.status.creator.versionOfType.version.systemId;
    params.namespaceSystemId = this.status.creator.versionOfType.type.namespace.systemId;
    return this._service.preFetchForUpdate(params)
  }

  private bulkOverWrite(objects: OsccObject[], ids: any[]): void {
    let minOrder = _.min(ids.map(
      (entry) => entry['versionOfType']['version']['orderInBundle']));
    for (let object of objects) {
      let relatedIds = ids
        .filter((entry) => entry.versionOfType.version.systemId == object.versionOfType.version.systemId)
        .map((entry) => entry.ids);
      let baseIds = ids
        .filter((entry) => entry.versionOfType.version.orderInBundle == minOrder)
        .map((entry) => entry.ids);
      this.overWrite(object, _.flattenDeep(relatedIds), _.flattenDeep(baseIds));
    }
  }

  private overWrite(object: OsccObject, relatedIds: any[], baseIds: any[]): void {
    let data = JSON.parse(object.serializedData);
    for (let key of Object.keys(data)) {
      if (Array.isArray(data[key])){
        let newList = [];
        for (let id of this.status.creator.data[key]){
          if (relatedIds.includes(id)) {
            newList.push(id);
          }
        }
        for (let id of data[key]) {
          if (!newList.includes(id)){
            if (!baseIds.includes(id)) {
              newList.push(id);
            }
          }
        }
        data[key] = newList;
      } else {
        data[key] = this.status.creator.data[key];
      }
    }
    object.serializedData = JSON.stringify(data);
  }

  private handleUpdateResponse(response: SuccessResponse) {
    this.status.setUpdating(false);
    if (response.successful) {
      this.status.reset();
      this._messages.add(new Success('Success', 'Object updated'));
    } else {
      this._messages.add(new Error('Oops', 'Something went wrong'))
    }
  }

  private createObject(): void {
    this._service.saveObjects(
      this._factory.createObjectCreateDto(this.status.creator)).subscribe(
      (response: SuccessResponse) => this.handleCreateResponse(response)
    );
  }

  protected multiLanguageDisabled(complexTypeKey: string, key: string): boolean {
    if (this.structure[key] != "multilanguage") { return false; }
    if (complexTypeKey == "unLocalized") {
      let multilanguage = this.status.creator.data[key];
      let allMultilanguageKeys = Object.keys(multilanguage).filter((entry) => entry != 'unLocalized');
      let anyFieldHasValue = allMultilanguageKeys
        .map((entry) => multilanguage[entry])
        .filter(this.exist).length > 0;
      return anyFieldHasValue;
    } else {
      return this.exist(this.status.creator.data[key]['unLocalized']);
    }
  }

  private exist(value: any): boolean {
    return !(value == null || value == undefined || value == "");
  }
}
