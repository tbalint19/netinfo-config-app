import { Component, OnInit } from '@angular/core';
import {StructureStatus} from "../../status/structure-status";

@Component({
  selector: 'structure-creator',
  templateUrl: './structure-creator.component.html',
  styleUrls: ['./structure-creator.component.css']
})
export class StructureCreatorComponent implements OnInit {

  constructor(protected status: StructureStatus) {
  }

  ngOnInit() {
  }

  openCreator(): void {
    this.status.toggle(true);
  }

  closeCreator(): void {
    document.getElementById("creator").classList.add("slideaway");
    document.getElementById("background").classList.add("disappear");
    setTimeout(()=>{
      this.status.toggle(false);
    }, 500);
  }

}
