import {Directive, ElementRef, HostListener, Input, Renderer} from '@angular/core';
import {PopupStatus} from "../status/popup-status";
import {ObjectEditorStatus} from "../status/object-editor-status";
import {StructureStatus} from "../status/structure-status";

@Directive({
  selector: '[escapeModal]'
})
export class EscapeDirective {

  constructor(
              public editorStatus: ObjectEditorStatus,
              public structureStatus: StructureStatus,
              public popupStatus: PopupStatus) { }

  @Input()
  popup: string;

  @HostListener('document:keyup', ['$event'])
  onClick(e) {
    if (e.key == 'Escape') {
      if (this.structureStatus.isEdited()) {
        this.structureStatus.toggleNewRow(false)
      } else if (this.structureStatus.isActive()) {
        this.structureStatus.toggleEditor(false)
      } else {
        document.getElementById("creator").classList.add("slideaway");
        document.getElementById("background").classList.add("disappear");
        setTimeout(()=>{
          if (this.popup == "objectPopup") {
            this.editorStatus.toggleEditor(false);
          } else {
            this.structureStatus.toggleEditor(false);
            this.popupStatus.toggle(false);
          }
        }, 500);
      }
    }
  }
}
