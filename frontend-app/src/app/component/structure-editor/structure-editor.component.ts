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
import {el} from "@angular/platform-browser/testing/src/browser_util";
import {Error} from "../../model/message/error.model";

@Component({
  selector: 'structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.css']
})
export class StructureEditorComponent implements OnInit {

  public creator: StructureCreator;
  public row: NewRow;

  constructor(protected status: StructureStatus,
              private _factory: DtoFactory,
              private namespaceStatus: NamespaceStatus,
              private _service: StructureService,
              private _messages: MessageService,
              private _popupStatus: PopupStatus,
              private _objectEditorStatus: ObjectEditorStatus) {
    this.creator = this.status.creator;
    this.row = this.status.row;
  }

  ngOnInit() {
  }

  protected saveStructure(): void {
    this._service.save(this._factory.createTypeCreateDto(
      this.creator, this.namespaceStatus.chosenNamespace)).subscribe(
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

  protected saveRow() {
    this.creator.structure[this.row.name] = this.row.value;
    this.row.reset();
    this.status.toggleNewRow(false);
  }

  protected getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  protected getName(obj: any) {
    return Object.keys(obj)[0];
  }

  protected deleteRow(key: string): void {
    delete this.creator.structure[key];
  }

  protected primitiveStructures(): any[] {
    return this.status.primitiveStrucutres.filter(entry => this.getName(entry) != 'list');
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
    this.status.objectStructures = response
      .filter(entry => entry.type.complex)
      .map(this.parseStructure);
    this.status.complexStructures = response
      .filter(entry => !entry.type.complex)
      .map(this.parseStructure);
  }

  private handleSuccessResponse() {
    this.updateStructures();
    this.resetEditor();
    this._objectEditorStatus.setReFetch(true);
    this._messages.add(new Success('Successful', 'Structure saved'));
  }
}
