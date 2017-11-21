import {Injectable} from "@angular/core";
import {RenderElements} from "../model/render-elements.enum";
import {StructureParams} from "../model/get-request/structure-params.model";
import {NewRow} from "../model/new-row.model";
import {StructureCreator} from "../model/structure-creator.model";
import {StructureValidator} from "../validator/structure-validator";
import {VersionOfType} from "../model/version-of-type.model";
import {StructureEditRestriction} from "../model/enums/structure-edit-restriction.enum";
import {Type} from "../model/type.model";

@Injectable()
export class StructureStatus {

  private _editorActive: boolean;
  private _newRowIsEdited: boolean;

  public primitiveStructures: any[];
  public complexParsedVersionOfType: any[];
  public objectParsedVersionOfType: any[];

  public editedStructure: any;

  public creator: StructureCreator;
  public params: StructureParams;
  public row: NewRow;
  public restriction: StructureEditRestriction;

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

  public toggleEditor(to: boolean, versionOfType?: any, restriction?: StructureEditRestriction): void {
    this.creator.systemId = versionOfType ? versionOfType['systemId'] : null;
    this.creator.type = versionOfType ? versionOfType['type'] : new Type();
    this.creator.isCommon = versionOfType ? !versionOfType['type']['complex'] : false;
    if (versionOfType) {
      let name = Object.keys(versionOfType['structure'])[0];
      this.creator.structure = versionOfType['structure'][name];
    } else {
      this.creator.structure = {};
    }
    this.restriction = StructureEditRestriction.NONE;
    if (restriction == 0) {
      this.restriction = 0;
    }
    if (restriction == 1) {
      this.restriction = 1;
    }
    this._editorActive = to;
  }

  public isEdited(): boolean {
    return this._newRowIsEdited;
  }

  public toggleNewRow(to: boolean): void {
    this._newRowIsEdited = to;
  }

  private initializeDefaultTypes(): void {
    this.primitiveStructures = [
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
    this.complexParsedVersionOfType = [];
    this.objectParsedVersionOfType = [];
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
    return this._validator.nameIsAvailable(this.creator.type.name, this.complexParsedVersionOfType.concat(this.objectParsedVersionOfType));
  }
}
