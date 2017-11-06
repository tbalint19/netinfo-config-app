import { Component, OnInit } from '@angular/core';
import {StructureStatus} from "../../status/structure-status";

@Component({
  selector: 'object-editor',
  templateUrl: './object-editor.component.html',
  styleUrls: ['./object-editor.component.css']
})
export class ObjectEditorComponent implements OnInit {

  protected object: any;
  protected objectKeys: String[];

  constructor(private status: StructureStatus) { }

  ngOnInit() {
    this.status.setStructure();
    this.object = {
      "id": "123xyz",
      "active": true,
      "price": 328,
      "name": {
        "eng": "hello",
        "hun": "szia"
      }
    }
    this.objectKeys = this.getKeys(this.object);
  }

  protected getKeys(obj: any){
    return Object.keys(obj);
  }

  protected shouldRenderTextField(key: string): boolean {
    return this.status.structure[key] == 'string';
  }

  protected shouldRenderNumberField(key: string): boolean {
    return this.status.structure[key] == 'number';
  }

  protected shouldRenderCheckbox(key: string): boolean {
    return this.status.structure[key] == 'boolean';
  }

  protected shouldRenderList(key: string): boolean {
    return this.status.structure[key].includes("list");
  }

  protected shouldRenderComplexType(key: string): boolean {
    let notText = !this.shouldRenderTextField(key);
    let notNumber = !this.shouldRenderNumberField(key);
    let notBox = !this.shouldRenderCheckbox(key);
    let notList = !this.shouldRenderList(key);
    return notText && notNumber && notBox && notList;
  }

  protected getInnerKeys(key: string){
    let innerObj = this.status.complexStructures.filter(
      (entry) => entry.hasOwnProperty(this.status.structure[key]))[0];
    let innerStructrure = innerObj[this.status.structure[key]];
    return Object.keys(innerStructrure);
  }

  protected shouldRenderTextFieldInComplex(key: string, innerKey: string): boolean {
    let innerObj = this.status.complexStructures.filter(
    (entry) => entry.hasOwnProperty(this.status.structure[key]))[0];
    let innerStructrure = innerObj[this.status.structure[key]];
    return innerStructrure[innerKey] == "string";
  }

  protected shouldRenderNumberFieldInComplex(key: string, innerKey: string): boolean {
    return this.status.structure[key][innerKey] == 'number';
  }

  protected shouldRenderCheckboxInComplex(key: string, innerKey: string): boolean {
    return this.status.structure[key][innerKey] == 'boolean';
  }

  public mockSend(): void {
    console.log(this.object);
  }
}
