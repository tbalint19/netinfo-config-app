import { Component, OnInit } from '@angular/core';
import {ObjectEditorStatus} from "../../status/object-editor-status";

@Component({
  selector: 'object-info',
  templateUrl: './object-info.component.html',
  styleUrls: ['./object-info.component.css']
})
export class ObjectInfoComponent implements OnInit {

  constructor(public objectEditorStatus: ObjectEditorStatus) { }

  ngOnInit() {
  }

  close(): void {
    this.objectEditorStatus.chosenObjectToSpectate = null;
  }

  getKeys(object: any): string[] {
    return Object.keys(object);
  }

  shouldShow(value: any): boolean {
    return typeof value != "object";
  }
}
