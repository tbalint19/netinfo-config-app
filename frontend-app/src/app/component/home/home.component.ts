import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {MessageService} from "../../service/message.service";
import {Note} from "../../model/message/note.model";
import {NamespaceStatus} from "../../status/namespace-status";
import {VersionStatus} from "../../status/version-status";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public namespaceStatus: NamespaceStatus,
    public versionStatus: VersionStatus) {
  }

  ngOnInit() {
    sessionStorage.removeItem("credential");
  }

}
