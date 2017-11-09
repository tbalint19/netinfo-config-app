import {Injectable} from "@angular/core";
import {RenderElements} from "../model/render-elements.enum";
import {StructureParams} from "../model/get-request/structure-params.model";
import {TypeCreateDto} from "../model/post-request/type-create-dto.model";
import {NewRow} from "../model/new-row.model";
import {StructureCreator} from "../model/structure-creator.model";

@Injectable()
export class StructureStatus {

  private _editorActive: boolean;
  private _newRowIsEdited: boolean;

  public primitiveStrucutres: any[];
  public complexStructures: any[];
  public objectStructures: any[];

  public editedStructure: any;

  public creator: StructureCreator;
  public params: StructureParams;
  public row: NewRow;

  constructor(){
    this.initializeDefaultTypes();
    this.creator = new StructureCreator();
    this.params = new StructureParams();
    this.complexStructures = [];
    this.objectStructures = [];
    this.row = new NewRow();
    this.editedStructure = {};
  }

  public isActive(): boolean {
    return this._editorActive;
  }

  public toggleEditor(to: boolean): void {
    this._editorActive = to;
  }

  public isEdited(): boolean {
    return this._newRowIsEdited;
  }

  public toggleNewRow(to: boolean): void {
    this._newRowIsEdited = to;
  }

  private initializeDefaultTypes(): void {
    this.primitiveStrucutres = [
      {"string": RenderElements.TEXT_INPUT},
      {"number": RenderElements.NUMBER_INPUT},
      {"boolean": RenderElements.CHECK_BOX},
      {"list": RenderElements.SELECT_LIST}
    ];
  }

}