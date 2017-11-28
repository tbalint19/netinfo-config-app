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

@Component({
  selector: 'structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.css']
})
export class StructureEditorComponent implements OnInit {

  constructor(
    protected status: StructureStatus,
    private _factory: DtoFactory,
    private versionStatus: VersionStatus,
    private namespaceStatus: NamespaceStatus,
    private _service: StructureService,
    private _messages: MessageService,
    private _popupStatus: PopupStatus,
    private _objectEditorStatus: ObjectEditorStatus) { }

  ngOnInit() {
  }

  protected update(): void {
    if (this.status.restriction == StructureEditRestriction.NONE){ this.saveStructure(); }
    if (this.status.restriction == StructureEditRestriction.UPDATE){ this.addToStructure(); }
    if (this.status.restriction == StructureEditRestriction.DELETE){ this.deleteFromStructure(); }
  }

  private saveStructure(): void {
    this._service.save(this._factory.createTypeCreateDto(
      this.status.creator, this.namespaceStatus.chosenNamespace)).subscribe(
      (response: SuccessResponse) => this.handleResponse(response)
    );
  }

  private deleteFromStructure(): void {
    let versionId = this.versionStatus.chosenVersion.systemId;
    let typeId = this.status.creator.type.systemId;
    this._service.preUpdate(versionId, typeId).subscribe(
      (dto: StructureUpdateDto) => {
        let updatedVersionOfTypes = dto.versionOfTypes.map(
          (original: VersionOfType) => {
            let newStructure = {};
            let name = this.status.creator.type.name;
            newStructure[name] = this.status.creator.structure;
            original.structure = JSON.stringify(newStructure);
            return original;
          }
        );
        let updatedObjects = dto.objects.map(
          (original: OsccObject) => {
            let newObj = {};
            for (let key of Object.keys(JSON.parse(original.serializedData))){
              if (Object.keys(this.status.creator.structure).includes(key)){
                newObj[key] = JSON.parse(original.serializedData)[key];
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
  private addToStructure(): void {
    let versionId = this.versionStatus.chosenVersion.systemId;
    let typeId = this.status.creator.type.systemId;
    this._service.preUpdate(versionId, typeId).subscribe(
      (dto: StructureUpdateDto) => {
        let updatedVersionOfTypes = dto.versionOfTypes.map(
          (original: VersionOfType) => {
            let newStructure = {};
            let name = this.status.creator.type.name;
            newStructure[name] = this.status.creator.structure;
            original.structure = JSON.stringify(newStructure);
            return original;
          }
        );
        let updatedObjects = dto.objects.map(
          (original: OsccObject) => {
            let newObj = {};
            for (let key of Object.keys(this.status.creator.structure)){
              if (Object.keys(JSON.parse(original.serializedData)).includes(key)){
                newObj[key] = JSON.parse(original.serializedData)[key];
              } else {
                newObj[key] = this.calculate(this.status.creator.structure[key]);
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
      console.log(this.status.complexParsedVersionOfType);
      let complexType = this.status.complexParsedVersionOfType.filter(
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

  protected reportTypeChange(): void {
    if (this.status.creator.type.complex) {
      this.status.creator.structure['Id'] = "string";
    } else {
      delete this.status.creator.structure['Id'];
    }
  }

  protected saveRow() {
    this.status.creator.structure[this.status.row.name] = this.status.row.value + " ---> " + this.status.row.defaultValue;
    this.status.row.reset();
    this.status.toggleNewRow(false);
  }

  protected getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  protected getName(obj: any) {
    return Object.keys(obj)[0];
  }

  protected deleteRow(key: string): void {
    delete this.status.creator.structure[key];
  }

  protected primitiveStructures(): any[] {
    return this.status.primitiveStructures.filter(entry => this.getName(entry) != 'list');
  }

  private resetEditor(): void {
    this.status.creator.reset();
    this.status.toggleEditor(false);
    this._popupStatus.toggle(false);
  }

  private updateStructures() {
    this._service.getStructures(this.status.params).subscribe(
      (response: VersionOfType[]) => this.handleArrivedStructures(response)
    );
  }

  private parseStructure(versionOfType: VersionOfType): any {
    return JSON.parse(versionOfType.structure);
  }

  private handleArrivedStructures(response: VersionOfType[]): void {
    this.status.objectParsedVersionOfType = response
      .filter(entry => entry.type.complex)
      .map(this.parseStructure);
    this.status.complexParsedVersionOfType = response
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

  protected NONE(): StructureEditRestriction {
    return StructureEditRestriction.NONE;
  }

  protected DELETE(): StructureEditRestriction {
    return StructureEditRestriction.DELETE;
  }

  protected UPDATE(): StructureEditRestriction {
    return StructureEditRestriction.UPDATE;
  }
}
