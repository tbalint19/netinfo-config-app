import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'structure-editor',
  templateUrl: './structure-editor.component.html',
  styleUrls: ['./structure-editor.component.css']
})
export class StructureEditorComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  public editedStructure: any;

}
