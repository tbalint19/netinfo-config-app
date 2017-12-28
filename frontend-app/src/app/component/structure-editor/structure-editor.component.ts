import {Component, OnInit} from '@angular/core';
import {StructureStatus} from "../../status/structure-status";
import {NewRow} from "../../model/new-row.model";
import {StructureCreator} from "../../model/structure-creator.model";
import {DtoFactory} from "../../factory/dto-factory";
import {NamespaceStatus} from "../../status/namespace-status";
import {StructureService} from "../../service/structure.service";
import {SuccessResponse} from "../../model/response/success-response.model";
import {VersionOfType} from "../../model/version-of-type.model";
import {MessageService} from "../../service/message.service";
import {Success} from "../../model/message/success.model";
import {PopupStatus} from "../../status/popup-status";
import {ObjectEditorStatus} from "../../status/object-editor-status";
import {Error} from "../../model/message/error.model";
import {StructureEditRestriction} from '../../model/enums/structure-edit-restriction.enum';
import {ObjectEditRestriction} from "../../model/enums/object-edit-restriction.enum";
import {OsccObject} from "../../model/object-model";
import {StructureUpdateDto} from "../../model/structure-update-dto";
import {VersionStatus} from "../../status/version-status";
import {StructureEditorService} from "../../service/editor/structure-editor.service";

@Component({
  selector: 'structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.css']
})
export class StructureEditorComponent implements OnInit {

  constructor(
    public _status: StructureStatus,
    private _factory: DtoFactory,
    private versionStatus: VersionStatus,
    private namespaceStatus: NamespaceStatus,
    private _service: StructureService,
    private _messages: MessageService,
    private _popupStatus: PopupStatus,
    private _objectEditorStatus: ObjectEditorStatus) { }

  ngOnInit() {
  }

  update(): void {
    if (this._status.restriction == StructureEditRestriction.NONE){ this.saveStructure(); }
    if (this._status.restriction == StructureEditRestriction.UPDATE){ this.addToStructure(); }
    if (this._status.restriction == StructureEditRestriction.DELETE){ this.deleteFromStructure(); }
  }

  private saveStructure(): void {
    this._service.save(this._factory.createTypeCreateDto(
      this._status.creator, this.namespaceStatus.chosenNamespace)).subscribe(
      (response: SuccessResponse) => this.handleResponse(response)
    );
  }

  private deleteFromStructure(): void {
    let versionId = this.versionStatus.chosenVersion.systemId;
    let typeId = this._status.creator.type.systemId;
    this._service.preUpdate(versionId, typeId).subscribe(
      (dto: StructureUpdateDto) => {
        let service = new StructureEditorService(this._status.creator.structure);
        let updatedVersionOfTypes = dto.versionOfTypes.map(
          (original: VersionOfType) => service.updateVersionOfTypeWhenDelete(original));
        let updatedObjects = dto.objects.map(
          (original: OsccObject) => service.updateObjectWhenDelete(original));
        let updateDTO = new StructureUpdateDto(updatedObjects, updatedVersionOfTypes);
        this.sendDto(updateDTO);
      }
    );
  }

  private addToStructure(): void {
    let versionId = this.versionStatus.chosenVersion.systemId;
    let typeId = this._status.creator.type.systemId;
    this._service.preUpdate(versionId, typeId).subscribe(
      (dto: StructureUpdateDto) => {
        let updatedVersionOfTypes = dto.versionOfTypes.map(
          (original: VersionOfType) => {
            let newStructure = {};
            let name = this._status.creator.type.name;
            newStructure[name] = this._status.creator.structure;
            original.structure = JSON.stringify(newStructure);
            return original;
          }
        );
        let updatedObjects = dto.objects.map(
          (original: OsccObject) => {
            let newObj = {};
            for (let key of Object.keys(this._status.creator.structure)){
              if (Object.keys(JSON.parse(original.serializedData)).includes(key)){
                newObj[key] = JSON.parse(original.serializedData)[key];
              } else {
                newObj[key] = this.calculate(this._status.creator.structure[key]);
              }
            }
            original.serializedData = JSON.stringify(newObj);
            return original;
          }
        );
        let updateDTO = new StructureUpdateDto(updatedObjects, updatedVersionOfTypes);
        this.sendDto(updateDTO);
      }
    );
  }

  private calculate(newValue): any {
    let value = newValue.split(" ---> ")[1] != "" ?
      newValue.split(" ---> ")[1] :
      this.getDefault(newValue.split(" ---> ")[0]);
    return value;
  }

  private getDefault(type: string): any {
    if (type.includes("string") || type.includes("number") || type.includes("boolean")) {
      return null;
    } else if (type.includes("-list")) {
      return [];
    } else {
      let complex = {};
      let complexType = this._status.complexParsedVersionOfType.filter(
        (entry) => Object.keys(entry['structure'])[0] == type
      )[0];
      for (let key of Object.keys(complexType['structure'][type])){
        complex[key] = null;
      }
      return complex;
    }
  }

  private sendDto(dto: StructureUpdateDto): void {
    this._service.update(dto).subscribe(
      (response: SuccessResponse) => this.handleResponse(response)
    );
  }

  private handleResponse(response: SuccessResponse): void {
    if (response.successful) {
      this.handleSuccessResponse();
    } else {
      this._messages.add(new Error('Opps', 'Something went wrong'));
    }
  }

  reportTypeChange(): void {
    if (this._status.creator.type.complex) {
      this._status.creator.structure['Id'] = "string";
    } else {
      delete this._status.creator.structure['Id'];
    }
  }

  saveRow() {
    this._status.creator.structure[this._status.row.name] = this._status.row.value + " ---> " + this._status.row.defaultValue;
    this._status.row.reset();
    this._status.toggleNewRow(false);
  }

  getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getName(obj: any) {
    return Object.keys(obj)[0];
  }

  deleteRow(key: string): void {
    delete this._status.creator.structure[key];
  }

  primitiveStructures(): any[] {
    return this._status.primitiveStructures.filter(entry => this.getName(entry) != 'list');
  }

  private resetEditor(): void {
    this._status.creator.reset();
    this._status.toggleEditor(false);
    this._popupStatus.toggle(false);
  }

  private updateStructures() {
    this._service.getStructures(this._status.params).subscribe(
      (response: VersionOfType[]) => this.handleArrivedStructures(response)
    );
  }

  private parseStructure(versionOfType: VersionOfType): any {
    return JSON.parse(versionOfType.structure);
  }

  private handleArrivedStructures(response: VersionOfType[]): void {
    this._status.objectParsedVersionOfType = response
      .filter(entry => entry.type.complex)
      .map(this.parseStructure);
    this._status.complexParsedVersionOfType = response
      .filter(entry => !entry.type.complex)
      .map(this.parseStructure);
  }

  private handleSuccessResponse() {
    this.updateStructures();
    this.resetEditor();
    this._objectEditorStatus.setReFetch(true);
    this._objectEditorStatus.chosenVersionOfType = null;
    this._objectEditorStatus.objects.length = 0;
    this._messages.add(new Success('Successful', 'Structure saved'));
  }

  NONE(): StructureEditRestriction {
    return StructureEditRestriction.NONE;
  }

  DELETE(): StructureEditRestriction {
    return StructureEditRestriction.DELETE;
  }

  UPDATE(): StructureEditRestriction {
    return StructureEditRestriction.UPDATE;
  }
}
