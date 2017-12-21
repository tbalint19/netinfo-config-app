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
import {isNullOrUndefined, isUndefined} from "util";

@Component({
  selector: 'object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements OnInit {

  protected structure: any;
  protected referenceStructure: any;
  protected primitives: any[];
  protected complexStructures: any[];
  protected objectStructures: any[];
  protected filteredList: OsccObject[] =[];

  constructor(protected status: ObjectEditorStatus,
              private _factory: DtoFactory,
              private _service: ObjectService,
              private _messages: MessageService) {
  }

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

  public structureKeys(): string[] {
    return Object.keys(this.structure);
  }

  protected updateRestriction(): ObjectEditRestriction {
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
    return key.split(" ---> ")[1] != "" ? key.split(" ---> ")[1] : null;
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
    for (let key of this.structureKeys()) {
      if (this.isText(this.parseValue(this.structure[key]))) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]) : this.status.creator.data[key];
      }
      if (this.isNumber(this.parseValue(this.structure[key]))) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? this.getDefaultValue(this.structure[key]) : this.status.creator.data[key];
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


  protected getObjects(key: string, structureKey: string): OsccObject[] {
    return this.status.objects.filter(
      (entry) => {
        return entry.versionOfType.type.name == structureKey.split("-")[0]
      })
      .sort((one: OsccObject, other: OsccObject) => {
          return this.shouldSortById(one, other, key) ? this.sortById(one, other) : this.sortByIsInList(one, other, key)
        }
      )
  }

  protected getIdentification(obj: OsccObject): string {
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
    return this.status.creator.data[key].includes(JSON.parse(object.serializedData)['Id']);
  }

  toggleList(object: OsccObject, key: string): void {
    let list = this.status.creator.data[key];
    let Id = JSON.parse(object.serializedData)['Id'];
    if (this.isInList(object, key)) {
      let index = list.indexOf(Id);
      this.status.creator.data[key].splice(index, 1);
    } else {
      list.push(Id);
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
    params.objectId = this.status.creator.data['Id'];
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
      if (isUndefined(this.status.creator.data[key])) {
        let currentValue = data[key];
        data[key] = currentValue;
      }
      else if (Array.isArray(data[key])) {
        let newList = [];
        for (let Id of this.status.creator.data[key]) {
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
    if (!this.status.dataIsValid()) {
      this._messages.add(new Error("Error", "Invalid id"));
      return;
    }
    this._service.saveObjects(
      this._factory.createObjectCreateDto(this.status.creator)).subscribe(
      (response: SuccessResponse) => this.handleCreateResponse(response)
    );
  }

  protected multiLanguageDisabled(complexTypeKey: string, key: string): boolean {
    if (this.parseValue(this.structure[key]) != "multilanguage") {
      return false;
    }
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

  protected resetSearch(): void {
    this.addAnimation();
    this.status.resetSearch();
    this.search(null, null, this.status.chosenRelation, this.parseValue(this.structure[this.status.chosenRelation]))
  }

  protected search(value: string, param: string, key: string, structureKey: string): void {
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

  protected referenceStructureKeys(structureKey: string): string[] {
    if (!structureKey || (structureKey && !this.isObjectList(this.structure[structureKey]))) {
      return [];
    }
    let referenceVoTName = this.structure[structureKey].split('-')[0];
    let fullStructure = this.objectStructures
      .find(entry => Object.keys(entry)[0] == referenceVoTName);
    let unpackedStructure = Object.values(fullStructure)[0];
    return Object.keys(unpackedStructure);
  }

  protected isHiddenInner(key: string, chosenRelation: string): boolean {
    let fullStructure = this.objectStructures
      .find(entry => Object.keys(entry)[0] == this.structure[chosenRelation].split("-list")[0]);
    let unpackedStructure = Object.values(fullStructure)[0];
    let isObjectlist = unpackedStructure[key].includes("-list");
    let isComplex = !isObjectlist && !(unpackedStructure[key].includes("number")) && !(unpackedStructure[key].includes("string")) && !(unpackedStructure[key].includes("boolean"));
    return isObjectlist || isComplex;
  }

  protected resetFieldFilter() {
    this.status.chosenField = null;
  }

  protected shouldShow(key: string, chosenField: string): boolean {
    return chosenField == null || key == chosenField || key == 'Id';
  }

  protected showRows(complexTypeKey: string, key: string, text: string): number {
    return this.multiLanguageDisabled(complexTypeKey, key) ? 1 : this.getNumberOfRows(text)
  }

  private getNumberOfRows(text: string): number {
    return text? Math.ceil(text.length/90) : 1
  }

  protected keyUpSearch(value: string, param: string, key: string, structureKey: string): void {
    setTimeout(() => {
      if (this.status.editorSearchValue == value && this.status.chosenEditorSearchParam == param) {
        this.search(value, param, key, structureKey)
      }
    }, 700)
  }

  protected resetSearchValue(): void {
    this.status.resetEditorSearchValue();
    this.search(null, null, this.status.chosenRelation, this.parseValue(this.structure[this.status.chosenRelation]))
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
}