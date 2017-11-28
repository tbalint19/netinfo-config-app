import { Injectable } from '@angular/core';
import {OsccObject} from "../model/object-model";
import {VersionOfType} from "../model/version-of-type.model";
import builder from 'xmlbuilder';
import _ from 'lodash';

@Injectable()
export class RenderService {

  private objects: OsccObject[];
  private versionOfTypes: VersionOfType[];

  constructor() { }

  public initialize(objects: OsccObject[], versionOfTypes: VersionOfType[]): void {
    this.objects = objects;
    this.versionOfTypes = versionOfTypes;
  }

  public renderAndDownload(rootObject: OsccObject): void {
    let filename = this.createFileName(rootObject);
    let rootElement = builder.create(rootObject.versionOfType.type.name);
    let objectData = JSON.parse(rootObject.serializedData);
    let xml = this.renderObject(rootElement, objectData, true);
    this.retardize(xml);
    this.download(filename, xml);
  }

  private createFileName(object: OsccObject): string {
    return object.versionOfType.type.namespace.name + "_" + object.versionOfType.type.name + ".xml";
  }

  private renderObject(rootElement: any, objectData: any, withDepth: boolean): string {
    let structure = this.getStructure(this.getRelated(objectData));
    for (let key of Object.keys(structure)){
      if (this.isPrimitive(structure, key)){
        this.renderPrimitive(rootElement, objectData, key);
      } else if (this.isObjectList(structure, key)){
        this.renderInnerObjects(rootElement, key, objectData, structure, withDepth);
      } else if (this.isMultiLanguage(structure, key)) {
        this.renderMultiLanuage(rootElement, key, objectData);
      } else {
        this.renderComplexType(rootElement, key, objectData);
      }
    }
    return rootElement.end({pretty: true});
  }

  private getRelated(obj: any): VersionOfType {
    return this.versionOfTypes.find(
      (entry: VersionOfType) => {
        let objectKeys = Object.keys(obj);
        let entryKeys = Object.keys(this.getStructure(entry));
        let containsAll = objectKeys.filter(
          (key: string) => !entryKeys.includes(key)
        ).length == 0;
        let almostSameLength = entryKeys.length - objectKeys.length < 4;
        return containsAll && almostSameLength;
      }
    );
  }

  private getStructure(versionOfType: VersionOfType): any {
    return JSON.parse(versionOfType.structure)[Object.keys(JSON.parse(versionOfType.structure))[0]];
  }

  private isPrimitive(structure: any, key: string): boolean {
    return structure[key].includes("string") || structure[key].includes("boolean") || structure[key].includes("number");
  }

  private renderPrimitive(rootElement: any, objectData: any, key: string): void {
    rootElement.ele(key, objectData[key]);
  }

  private isObjectList(structure: any, key: string): boolean {
    return structure[key].includes("-list");
  }

  private getRelatedObjects(root: any, key: string): OsccObject[] {
    return this.objects.filter(
      (entry: OsccObject) => root[key].includes(JSON.parse(entry.serializedData)["Id"])
    );
  }

  private renderInnerObjects(rootElement, key, objectData, structure, withDepth): void {
    let listElement = rootElement.ele(key);
    let relatedObjects = this.getRelatedObjects(objectData, key);
    for (let related of relatedObjects){
      if (withDepth){
        let innerRoot = listElement.ele(structure[key].split("-list")[0]);
        let innerObject = JSON.parse(related.serializedData);
        this.renderObject(innerRoot,innerObject, false);
      } else {
        listElement.ele(related.versionOfType.type.name, JSON.parse(related.serializedData)['Id'])
      }
    }
  }

  private isMultiLanguage(structure: any, key: string): boolean {
    return structure[key] == "multilanguage";
  }

  private renderMultiLanuage(rootElement, key, objectData): void {
    if (objectData[key]["unLocalized"] == ""){
      rootElement.ele(key, {localized: true});
    } else {
      rootElement.ele(key, {localized: false}, objectData[key]["unLocalized"]);
    }
  }

  private renderComplexType(rootElement, key, objectData): void {
    let innerRoot = rootElement.ele(key);
    if (objectData[key]){
      this.renderObject(innerRoot, objectData[key], false);
    }
  }

  private retardize(xml: string): void {

  }

  private download(filename: string, text: string): void {
    let pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    if (document.createEvent) {
      let event = document.createEvent('MouseEvents');
      event.initEvent('click', true, true);
      pom.dispatchEvent(event);
    } else {
      pom.click();
    }
  }

}
