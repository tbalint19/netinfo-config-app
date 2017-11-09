import {Injectable} from "@angular/core";
import {ObjectCreator} from "../model/object-creator.model";
import {Object} from "../model/object-model";
import {VersionOfType} from "../model/version-of-type.model";
import {ObjectParams} from "../model/get-request/object-params.model";

@Injectable()
export class ObjectEditorStatus {

  private _shouldReFetch: boolean;
  public chosenStructure: any;
  public creator: ObjectCreator;
  public objects: Object[];
  public versionOfTypes: VersionOfType[];
  public params: ObjectParams;

  constructor(){
    this.creator = new ObjectCreator();
    this.params = new ObjectParams();
    this._shouldReFetch = false;
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

}