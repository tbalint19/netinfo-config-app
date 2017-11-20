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

@Component({
  selector: 'structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.css']
})
export class StructureEditorComponent implements OnInit {

  constructor(
    protected status: StructureStatus,
    private _factory: DtoFactory,
    private namespaceStatus: NamespaceStatus,
    private _service: StructureService,
    private _messages: MessageService,
    private _popupStatus: PopupStatus,
    private _objectEditorStatus: ObjectEditorStatus) { }

  ngOnInit() {
  }

  protected saveStructure(): void {
    this._service.save(this._factory.createTypeCreateDto(
      this.status.creator, this.namespaceStatus.chosenNamespace)).subscribe(
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
      this.status.creator.structure['id'] = "string";
    } else {
      delete this.status.creator.structure['id'];
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
