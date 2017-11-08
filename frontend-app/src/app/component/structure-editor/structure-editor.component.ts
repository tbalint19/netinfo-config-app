import {Component, Input, OnInit} from '@angular/core';
import {StructureStatus} from "../../status/structure-status";
import {NewRow} from "../../model/new-row.model";
import {StructureCreator} from "../../model/structure-creator.model";
import {DtoFactory} from "../../factory/dto-factory";
import {NamespaceStatus} from "../../status/namespace-status";
import {StructureService} from "../../service/structure.service";
import {SuccessResponse} from "../../model/response/success-response.model";

@Component({
  selector: 'structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.css']
})
export class StructureEditorComponent implements OnInit {

  public creator: StructureCreator;
  public row: NewRow;

  constructor(
    protected status: StructureStatus,
    private _factory: DtoFactory,
    private namespaceStatus: NamespaceStatus,
    private _service: StructureService) {
    this.creator = this.status.creator;
    this.row = this.status.row;
  }

  ngOnInit() {
  }

  protected saveStructure(): void {
    this._service.save(this._factory.createTypeCreateDto(
      this.creator, this.namespaceStatus.chosenNamespace)).subscribe(
      (response: SuccessResponse) => console.log(response)
    );
  }

  protected saveRow() {
    this.creator.structure[this.row.name] = this.row.value;
    this.row.reset();
    this.status.toggleNewRow(false);
  }

  protected getKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  protected getName(obj: any){
    return Object.keys(obj)[0];
  }

  protected deleteRow(key: string): void {
    delete this.creator.structure[key];
  }
}
