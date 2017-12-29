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
import * as _ from 'lodash';
import {PreUpdateObjectsParams} from "../../model/get-request/pre-update-objects-params";
import {Observable} from "rxjs/Observable";
import {VersionOfTypeWithIds} from "../../model/response/version-of-type-with-ids";
import {PreUpdateObjectsResponse} from "../../model/response/pre-update-objects-response";
import {ObjectEditRestriction} from "../../model/enums/object-edit-restriction.enum";
import {isNullOrUndefined, isUndefined} from "util";

@Component({
  selector: 'object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements OnInit {

  structure: any;
  referenceStructure: any;
  primitives: any[];
  complexStructures: any[];
  objectStructures: any[];
  filteredList: OsccObject[] =[];

  constructor(public _status: ObjectEditorStatus,
              private _factory: DtoFactory,
              private _service: ObjectService,
              private _messages: MessageService) {
  }

  ngOnInit() {
    this.structure = JSON.parse(this._status.chosenVersionOfType.structure);
    this.structure = this.structure[Object.keys(this.structure)[0]];
    this.primitives = this.getPrimitives();
    this.complexStructures = this._status.versionOfTypes.filter(
      (entry) => !entry.type.complex
    ).map((entry) => JSON.parse(entry.structure));
    this.objectStructures = this._status.versionOfTypes.filter(
      (entry) => entry.type.complex
    ).map((entry) => JSON.parse(entry.structure));
    this.createBaseData();
  }

  public structureKeys(): string[] {
    return Object.keys(this.structure);
  }

  updateRestriction(): ObjectEditRestriction {
    return ObjectEditRestriction.UPDATE;
  }

  complexTypeKeys(complexTypeName: string): string[] {
    let structure = this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complexTypeName))[0];
    return Object.keys(structure[Object.keys(structure)[0]]);
  }

  isText(key: string, complex?: string): boolean {
    let k = complex ? this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complex)
    )[0][complex][key] : key;
    return this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    )[0][k] == RenderElements.TEXT_INPUT;
  }

  parseValue(key: string): string {
    return key.split(" ---> ")[0];
  }

  getDefaultValue(key: string): string {
    return key.split(" ---> ")[1] != "" ? key.split(" ---> ")[1] : null;
  }

  isNumber(key: string, complex?: string): boolean {
    let k = complex ? this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complex)
    )[0][complex][key] : key;
    return this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    )[0][k] == RenderElements.NUMBER_INPUT;
  }

  isBoolean(key: string, complex?: string): boolean {
    let k = complex ? this.complexStructures.filter(
      (entry) => entry.hasOwnProperty(complex)
    )[0][complex][key] : key;
    return this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(k)
    )[0][k] == RenderElements.CHECK_BOX;
  }

  isComplex(key: string): boolean {
    return this.complexStructures.filter(
      entry => entry.hasOwnProperty(key)
    ).length == 1;
  }

  isObjectList(key: string): boolean {
    let listName = key.split("-")[1];
    return this.primitives.filter(
      entry => entry.hasOwnProperty(listName)
    ).length == 1 && this.primitives.filter(
      entry => entry.hasOwnProperty(listName)
    )[0][listName] == RenderElements.SELECT_LIST;
  }

  private createBaseData(): void {
    this._status.creator.versionOfType = this._status.chosenVersionOfType;
    for (let key of this.structureKeys()) {
      if (this.isText(this.parseValue(this.structure[key]))) {
        this._status.creator.data[key] = this._status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]) : this._status.creator.data[key];
      }
      if (this.isNumber(this.parseValue(this.structure[key]))) {
        this._status.creator.data[key] = this._status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]) : this._status.creator.data[key];
      }
      if (this.isBoolean(this.parseValue(this.structure[key]))) {
        this._status.creator.data[key] = this._status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]) == "true" ? true : false : this._status.creator.data[key];
      }
      if (this.isComplex(this.parseValue(this.structure[key]))) {
        this._status.creator.data[key] = this._status.creator.data[key] === undefined ? {} : this._status.creator.data[key];
      }
      if (this.isObjectList(this.parseValue(this.structure[key]))) {
        this._status.creator.data[key] = this._status.creator.data[key] === undefined ? [] : this._status.creator.data[key];
      }
    }
  }

  private sortById(one: OsccObject, other: OsccObject): number {
    return one['id'] > other['id'] ? 1 : -1
  }

  private shouldSortById(one: OsccObject, other: OsccObject, key: string): boolean {
    let oneIn = this.isInList(one, key);
    let otherIn = this.isInList(other, key);
    return (oneIn && otherIn) || (!oneIn && !otherIn)
  }

  private sortByIsInList(one: OsccObject, other: OsccObject, key: string): number {
    let oneIn = this.isInList(one, key);
    let otherIn = this.isInList(other, key);
    return !oneIn && otherIn ? 1 : -1
  }


  getObjects(key: string, structureKey: string): OsccObject[] {
    return this._status.objects.filter(
      (entry) => {
        return entry.versionOfType.type.name == structureKey.split("-")[0]
      })
      .sort((one: OsccObject, other: OsccObject) => {
          return this.shouldSortById(one, other, key) ? this.sortById(one, other) : this.sortByIsInList(one, other, key)
        }
      )
  }

  getIdentification(obj: OsccObject): string {
    return JSON.parse(obj.serializedData)['Id'];
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
    if (this._status.creator.systemId) {
      this.updateObject();
    } else {
      this.createObject();
    }
  }

  private handleCreateResponse(response: SuccessResponse) {
    if (response.successful) {
      this._status.reset();
      this._messages.add(new Success('Success', 'Object created'));
    } else {
      this._messages.add(new Error('Oops', 'Something went wrong'))
    }
  }

  isInList(object: OsccObject, key: string): boolean {
    return this._status.creator.data[key].includes(JSON.parse(object.serializedData)['Id']);
  }

  toggleList(object: OsccObject, key: string): void {
    let list = this._status.creator.data[key];
    let Id = JSON.parse(object.serializedData)['Id'];
    if (this.isInList(object, key)) {
      let index = list.indexOf(Id);
      this._status.creator.data[key].splice(index, 1);
    } else {
      list.push(Id);
    }
  }

  private updateObject(): void {
    this._status.setUpdating(true);
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
    params.objectId = this._status.creator.data['Id'];
    params.versionSystemId = this._status.creator.versionOfType.version.systemId;
    params.namespaceSystemId = this._status.creator.versionOfType.type.namespace.systemId;
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
      if (isUndefined(this._status.creator.data[key])) {
        let currentValue = data[key];
        data[key] = currentValue;
      }
      else if (Array.isArray(data[key])) {
        let newList = [];
        for (let Id of this._status.creator.data[key]) {
          if (relatedIds.includes(Id)) {
            newList.push(Id);
          }
        }
        for (let Id of data[key]) {
          if (!newList.includes(Id)) {
            if (!baseIds.includes(Id)) {
              newList.push(Id);
            }
          }
        }
        data[key] = newList;
      }
      else {
        data[key] = this._status.creator.data[key];
      }
    }
    object.serializedData = JSON.stringify(data);
  }

  private handleUpdateResponse(response: SuccessResponse) {
    this._status.setUpdating(false);
    if (response.successful) {
      this._status.reset();
      this._messages.add(new Success('Success', 'Object updated'));
    } else {
      this._messages.add(new Error('Oops', 'Something went wrong'))
    }
  }

  private createObject(): void {
    if (!this._status.dataIsValid()) {
      this._messages.add(new Error("Error", "Invalid id"));
      return;
    }
    this._service.saveObjects(
      this._factory.createObjectCreateDto(this._status.creator)).subscribe(
      (response: SuccessResponse) => this.handleCreateResponse(response)
    );
  }

  multiLanguageDisabled(complexTypeKey: string, key: string): boolean {
    if (this.parseValue(this.structure[key]) != "multilanguage") {
      return false;
    }
    if (complexTypeKey == "unLocalized") {
      let multilanguage = this._status.creator.data[key];
      let allMultilanguageKeys = Object.keys(multilanguage).filter((entry) => entry != 'unLocalized');
      let anyFieldHasValue = allMultilanguageKeys
        .map((entry) => multilanguage[entry])
        .filter(this.exist).length > 0;
      return anyFieldHasValue;
    } else {
      return this.exist(this._status.creator.data[key]['unLocalized']);
    }
  }

  private exist(value: any): boolean {
    return !(value == null || value == undefined || value == "");
  }

  resetSearch(): void {
    this.addAnimation();
    this._status.resetSearch();
    this.search(null, null, this._status.chosenRelation, this.parseValue(this.structure[this._status.chosenRelation]))
  }

  search(value: string, param: string, key: string, structureKey: string): void {
    if (value == null || param == null) {
      this.filteredList = this.getObjects(key, structureKey);
    } else {
      if (param == "Id") {
        this.filteredList = this.getObjects(key, structureKey).filter(entry => entry['id'].indexOf(value) > -1
        )
      }
      else {
        this.filteredList = this.getObjects(key, structureKey).filter(entry => {
          return JSON.stringify(JSON.parse(entry.serializedData)[param]).indexOf(value) > -1;
        })
      }
    }
    this.stopAnimation();
  }

  referenceStructureKeys(structureKey: string): string[] {
    if (!structureKey || (structureKey && !this.isObjectList(this.structure[structureKey]))) {
      return [];
    }
    let referenceVoTName = this.structure[structureKey].split('-')[0];
    let fullStructure = this.objectStructures
      .find(entry => Object.keys(entry)[0] == referenceVoTName);
    let unpackedStructure = Object.values(fullStructure)[0];
    return Object.keys(unpackedStructure);
  }

  isHiddenInner(key: string, chosenRelation: string): boolean {
    let fullStructure = this.objectStructures
      .find(entry => Object.keys(entry)[0] == this.structure[chosenRelation].split("-list")[0]);
    let unpackedStructure = Object.values(fullStructure)[0];
    let isObjectlist = unpackedStructure[key].includes("-list");
    let isComplex = !isObjectlist && !(unpackedStructure[key].includes("number")) && !(unpackedStructure[key].includes("string")) && !(unpackedStructure[key].includes("boolean"));
    return isObjectlist || isComplex;
  }

  resetFieldFilter() {
    this._status.chosenField = null;
  }

  shouldShow(key: string, chosenField: string): boolean {
    return chosenField == null || key == chosenField || key == 'Id';
  }

  showRows(complexTypeKey: string, key: string, text: string): number {
    return this.multiLanguageDisabled(complexTypeKey, key) ? 1 : this.getNumberOfRows(text)
  }

  private getNumberOfRows(text: string): number {
    return text? Math.ceil(text.length/90) : 1
  }

  keyUpSearch(value: string, param: string, key: string, structureKey: string): void {
    setTimeout(() => {
      if (this._status.editorSearchValue == value && this._status.chosenEditorSearchParam == param) {
        this.search(value, param, key, structureKey)
      }
    }, 700)
  }

  resetSearchValue(): void {
    this._status.resetEditorSearchValue();
    this.search(null, null, this._status.chosenRelation, this.parseValue(this.structure[this._status.chosenRelation]))
  }

  private addAnimation(): void {
    document.getElementById('editor-spinner').classList.add("spinning-animation")
  }

  private stopAnimation(): void {
    setTimeout(() => {
      if (document.getElementById('editor-spinner').classList.contains("spinning-animation")) {
        document.getElementById('editor-spinner').classList.remove("spinning-animation")
      }
    }, 500)
  }

  public addAll(): void {
    this._status.creator.data[this._status.chosenRelation] = this.filteredList.map(
      (osccObj: OsccObject) => JSON.parse(osccObj.serializedData)["Id"]
    );
  }

  public deleteAll(): void {
    this._status.creator.data[this._status.chosenRelation] = [];
  }

  public openObjectInfo(object: OsccObject): void {
    this._status.chosenObjectToSpectate = JSON.parse(object.serializedData);
  }
}
