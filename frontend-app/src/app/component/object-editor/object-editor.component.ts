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
      if (this.isText(this.structure[key])) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? "" : this.status.creator.data[key];
      }
      if (this.isNumber(this.structure[key])) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? 0: this.status.creator.data[key];
      }
      if (this.isBoolean(this.structure[key])) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? false : this.status.creator.data[key];
      }
      if (this.isComplex(this.structure[key])) {
        this.status.creator.data[key] = this.status.creator.data[key] === undefined ? {} : this.status.creator.data[key];
      }
      if (this.isObjectList(this.structure[key])) {
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
    this._service.updateObjects(this._factory.createObject(this.status.creator)).subscribe(
      (response: SuccessResponse) => this.handleUpdateResponse(response)
    )
  }

  private handleUpdateResponse(response: SuccessResponse) {
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
}
