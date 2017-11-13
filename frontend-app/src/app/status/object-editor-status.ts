import {Injectable} from "@angular/core";
import {ObjectCreator} from "../model/object-creator.model";
import {OsccObject} from "../model/object-model";
import {VersionOfType} from "../model/version-of-type.model";
import {ObjectParams} from "../model/get-request/object-params.model";

@Injectable()
export class ObjectEditorStatus {

  private _editorOpened: boolean;
  private _shouldReFetch: boolean;
  public chosenStructure: any;
  public creator: ObjectCreator;
  public objects: OsccObject[];
  public versionOfTypes: VersionOfType[];
  public chosenVersionOfType: VersionOfType;
  public params: ObjectParams;

  constructor() {
    this.initialize();
  }

  public setStructure(structure: any): void {
    this.chosenStructure = structure;
  }

  public shouldReFetch(): boolean {
    return this._shouldReFetch;
  }

  public setReFetch(to: boolean) {
    this._shouldReFetch = to;
  }

  public isOpen(): boolean {
    return this._editorOpened;
  }

  public toggleEditor(to: boolean): void {
    this._editorOpened = to;
  }

  private initialize(): void {
    this._editorOpened = false;
    this._shouldReFetch = true;
    this.creator = new ObjectCreator();
    this.params = new ObjectParams();
    this.versionOfTypes = [];
    this.objects = [];
    this.chosenStructure = null;
  }

  public reset(): void {
    this.initialize();
  }
}