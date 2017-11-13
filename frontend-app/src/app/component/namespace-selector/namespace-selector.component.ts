import {Component, Input, OnInit} from '@angular/core';
import {Namespace} from "../../model/namespace.model";
import {NamespaceService} from "../../service/namespace.service";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Error} from "../../model/message/error.model";
import {Success} from "../../model/message/success.model";
import {NamespaceStatus} from "../../status/namespace-status";
import {ObjectEditorStatus} from "../../status/object-editor-status";
import {VersionStatus} from "../../status/version-status";

@Component({
  selector: 'namespace-selector',
  templateUrl: './namespace-selector.component.html',
  styleUrls: ['./namespace-selector.component.css']
})
export class NamespaceSelectorComponent implements OnInit {

  constructor(
    protected objectEditorStatus: ObjectEditorStatus,
    private _versionStatus: VersionStatus,
    private nameSpaceService: NamespaceService,
    private messages: MessageService,
    protected status: NamespaceStatus) {
  }

  ngOnInit() {
      this.updateNamespaces();
  }


  private updateNamespaces(): void {
      this.nameSpaceService.getNamespaces().subscribe(
          (namespaces: Namespace[]) => this.handleUpdateNamespace(namespaces)
      );
  }

  private handleUpdateNamespace(namespaces: Namespace[]): void {
    this.status.namespaces = namespaces;
    if (localStorage.getItem('namespace')) {
      let namespaceFromStorage = JSON.parse(localStorage.getItem('namespace'));
      this.status.chosenNamespace = this.status.namespaces.find(
        (entry) => entry.systemId == namespaceFromStorage.systemId
      );
      this.notify();
    }
  }

  protected createNamespace(): void {
    if (!this.status.isValid() || !this.status.isAvailable()) {
      this.suspend();
      return;
    }
    this.nameSpaceService.createNamespace(this.status.createdNamespace).subscribe(
        (response: SuccessResponse) => this.handleCreateResponse(response.successful)
    );
  }

  private suspend(): void {
    this.messages.add(new Error("Invalid format!", "No namespace created"));
    this.status.setSuspended(true);
    setTimeout(()=>{this.status.setSuspended(false)}, 5000);
  }

  private handleCreateResponse(successful: boolean): void {
    if (!successful) {
      this.messages.add(new Error("Oooops", "Not created"));
      return;
    }
    this.messages.add(new Success("Success", "Namespace created"));
    this.status.createdNamespace.reset();
    this.updateNamespaces();
  }

  protected handleModelChange(): void {
    this.notify();
    localStorage.setItem('namespace', JSON.stringify(this.status.chosenNamespace));
    this.objectEditorStatus.chosenVersionOfType = null;
  }

  private notify(): void {
    if (this._versionStatus.chosenVersion) {
      this.objectEditorStatus.setReFetch(true);
    }
  }
}
