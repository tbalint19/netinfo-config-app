import { Component, OnInit } from '@angular/core';
import {ObjectEditorStatus} from "../../status/object-editor-status";

@Component({
  selector: 'object-popup',
  templateUrl: './object-popup.component.html',
  styleUrls: ['./object-popup.component.css']
})
export class ObjectPopupComponent implements OnInit {

  constructor(protected status: ObjectEditorStatus) { }

  ngOnInit() {
  }

  closePopup(): void {
    document.getElementById("creator").classList.add("slideaway");
    document.getElementById("background").classList.add("disappear");
    setTimeout(()=>{
      this.status.toggleEditor(false);
    }, 500);
  }

}