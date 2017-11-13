import {Injectable} from "@angular/core";
import {RenderElements} from "../model/render-elements.enum";
import {StructureParams} from "../model/get-request/structure-params.model";
import {NewRow} from "../model/new-row.model";
import {StructureCreator} from "../model/structure-creator.model";
import {StructureValidator} from "../validator/structure-validator";
import {VersionOfType} from "../model/version-of-type.model";

@Injectable()
export class StructureStatus {

  private _editorActive: boolean;
  private _newRowIsEdited: boolean;

  public primitiveStrucutres: any[];
  public complexStructures: any[];
  public objectStructures: any[];

  public editedStructure: any;
  public refactoredStructure: any;

  public creator: StructureCreator;
  public params: StructureParams;
  public row: NewRow;

  constructor(
    private _validator: StructureValidator) {
    this.creator = new StructureCreator();
    this.params = new StructureParams();
    this.row = new NewRow();
    this.initialize();
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

  public initialize(): void {
    this._editorActive = false;
    this._newRowIsEdited = false;
    this.initializeDefaultTypes();
    this.complexStructures = [];
    this.objectStructures = [];
    this.editedStructure = {};
    this.creator.reset();
    this.params.reset();
    this.row.reset();
  }

  public nameIsValid(): boolean {
    return this._validator.nameIsValid(this.creator.type.name);
  }

  public keyIsValid(): boolean {
    return this._validator.keyIsValid(this.row.name);
  }

  public valueIsValid(): boolean {
    return this._validator.valueIsValid(this.row.value);
  }

  public structureIsValid(): boolean {
    return this._validator.notEmpty(this.creator.structure);
  }

  public creatorIsValid(): boolean {
    return this.nameIsValid() && this.structureIsValid() && this.nameIsAvailable();
  }

  public rowIsValid(): boolean {
    return this.keyIsValid() && this.valueIsValid();
  }

  public nameIsAvailable(): boolean {
    return this._validator.nameIsAvailable(this.creator.type.name, this.complexStructures.concat(this.objectStructures));
  }
}
