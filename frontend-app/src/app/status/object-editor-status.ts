import {Injectable} from "@angular/core";
import {ObjectCreator} from "../model/object-creator.model";
import {OsccObject} from "../model/object-model";
import {VersionOfType} from "../model/version-of-type.model";
import {ObjectParams} from "../model/get-request/object-params.model";
import {HttpClient} from "../http/http.client";

@Injectable()
export class ObjectEditorStatus {

  private _editorOpened: boolean;
  private _shouldReFetch: boolean;
  private _isUpdating: boolean;
  public chosenStructure: any;
  public creator: ObjectCreator;
  public objects: OsccObject[];
  public versionOfTypes: VersionOfType[];
  public chosenVersionOfType: VersionOfType;
  public params: ObjectParams;

  constructor(private _requestObserver: HttpClient) {
    this.initialize();
  }

  public setStructure(structure: any): void {
    this.chosenStructure = structure;
  }

  // public isPreFetching(): boolean {
  //   return this._requestObserver.findPending()
  // }

  public isUpdating(): boolean {
    return this._isUpdating;
  }

  public setUpdating(to: boolean): void {
    this._isUpdating = to;
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
    this._isUpdating = false;
  }

  public reset(): void {
    this.initialize();
  }
}