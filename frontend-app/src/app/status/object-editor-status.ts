import {Injectable} from "@angular/core";
import {ObjectCreator} from "../model/object-creator.model";
import {OsccObject} from "../model/object-model";
import {VersionOfType} from "../model/version-of-type.model";
import {ObjectParams} from "../model/get-request/object-params.model";
import {HttpClient} from "../http/http.client";
import {ObjectEditRestriction} from "../model/enums/object-edit-restriction.enum";
import {ObjectValidator} from "../validator/object-validator";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {isBoolean} from "util";

@Injectable()
export class ObjectEditorStatus {

  private _editorOpened: boolean;
  public shouldReFetch: Subject<boolean> = new Subject<boolean>();
  private _isUpdating: boolean;

  public chosenField: string;
  public searchValue: string;
  public chosenSearchParam: string;
  public chosenEditorSearchParam: string;
  public editorSearchValue: string;
  public chosenRelation: string;
  public restriction: ObjectEditRestriction;
  public chosenStructure: any;
  public creator: ObjectCreator;
  public objects: OsccObject[];
  public versionOfTypes: VersionOfType[];
  public chosenVersionOfType: VersionOfType;
  public params: ObjectParams;
  public chosenRelationalObject: OsccObject;
  public relationalObjectPresenter: boolean;


  constructor(private _requestObserver: HttpClient,
              private _validator: ObjectValidator) {
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

  public setReFetch(to: boolean) {
    this.shouldReFetch.next(to);
  }

  public isOpen(): boolean {
    return this._editorOpened;
  }

  public toggleEditor(to: boolean): void {
    this.chosenRelation = null;
    this.chosenEditorSearchParam = null;
    this.editorSearchValue = null;
    this._editorOpened = to;
  }

  private initialize(): void {
    this._editorOpened = false;
    this.searchValue = null;
    this.chosenSearchParam = null;
    this.chosenRelation = null;
    this.chosenEditorSearchParam = null;
    this.editorSearchValue = null;
    this.chosenField = null;
    this.creator = new ObjectCreator();
    this.params = new ObjectParams();
    this.versionOfTypes = [];
    this.objects = [];
    this.chosenStructure = null;
    this._isUpdating = false;
    this.shouldReFetch.next(true);
  }

  public reset(): void {
    this.initialize();
  }

  public dataIsValid() {
    return this._validator.dataIsValid(this.creator.data['Id'])
  }

  public resetSearch(): void {
    this.chosenEditorSearchParam = null;
    this.editorSearchValue = null;
  }

  public resetEditorSearchValue() {
    if (!!this.editorSearchValue) {
      this.editorSearchValue = null;
    }
  }
}

