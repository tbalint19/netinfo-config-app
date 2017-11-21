import { Component, OnInit } from '@angular/core';
import {VersionOfType} from "../../model/version-of-type.model";
import {VersionStatus} from "../../status/version-status";
import {NamespaceStatus} from "../../status/namespace-status";
import {StructureStatus} from "../../status/structure-status";
import {StructureService} from "../../service/structure.service";

@Component({
  selector: 'structure-manager',
  templateUrl: './structure-manager.component.html',
  styleUrls: ['./structure-manager.component.css']
})
export class StructureManagerComponent implements OnInit {

  constructor(
    private versionStatus: VersionStatus,
    private namespaceStatus: NamespaceStatus,
    protected status: StructureStatus,
    private service: StructureService) { }

  ngOnInit() {
    this.status.params.namespaceId = this.namespaceStatus.chosenNamespace.systemId;
    this.status.params.versionId = this.versionStatus.chosenVersion.systemId;
    this.getVersionOfTypes();
  }

  private getVersionOfTypes(): void {
    this.service.getStructures(this.status.params).subscribe(
      (response: VersionOfType[]) => this.handleArrivedStructures(response)
    );
  }

  private parseStructure(versionOfType: VersionOfType): any {
    versionOfType.structure = JSON.parse(versionOfType.structure);
    return versionOfType;
  }

  private handleArrivedStructures(response: VersionOfType[]): void {
    this.status.objectParsedVersionOfType = response
      .filter(entry => entry.type.complex)
      .map(this.parseStructure);
    this.status.complexParsedVersionOfType = response
      .filter(entry => !entry.type.complex)
      .map(this.parseStructure);
  }

}
