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
import {ConfirmModalStatus} from "../../status/confirm-modal-status";

@Component({
  selector: 'namespace-selector',
  templateUrl: './namespace-selector.component.html',
  styleUrls: ['./namespace-selector.component.css']
})
export class NamespaceSelectorComponent implements OnInit {

  constructor(
    public objectEditorStatus: ObjectEditorStatus,
    private _versionStatus: VersionStatus,
    public confirmModalStatus: ConfirmModalStatus,
    private nameSpaceService: NamespaceService,
    private messages: MessageService,
    public _status: NamespaceStatus) {
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
    this._status.namespaces = namespaces;
    if (localStorage.getItem('namespace')) {
      let namespaceFromStorage = JSON.parse(localStorage.getItem('namespace'));
      this._status.chosenNamespace = this._status.namespaces.find(
        (entry) => entry.systemId == namespaceFromStorage.systemId
      );
      this.notify();
    }
  }

  createNamespace(): void {
    if (!this._status.isValid() || !this._status.isAvailable()) {
      this.suspend();
      return;
    }
    this.confirmCreate();
  }

  private confirmCreate(): void {
    this.confirmModalStatus.data = this._status.createdNamespace;
    this.confirmModalStatus.chosenSelector = "namespace";
    this.confirmModalStatus.confirmModalIsShown = true;
  }

  public saveNamespace(): void {
    this.nameSpaceService.createNamespace(this._status.createdNamespace).subscribe(
      (response: SuccessResponse) => this.handleCreateResponse(response.successful)
    );
  }

  private suspend(): void {
    this.messages.add(new Error("Invalid format!", "No namespace created"));
    this._status.setSuspended(true);
    setTimeout(()=>{this._status.setSuspended(false)}, 5000);
  }

  private handleCreateResponse(successful: boolean): void {
    if (!successful) {
      this.messages.add(new Error("Oooops", "Not created"));
      return;
    }
    this.messages.add(new Success("Success", "Namespace created"));
    this._status.createdNamespace.reset();
    this.updateNamespaces();
  }

  handleModelChange(): void {
    this.notify();
    localStorage.setItem('namespace', JSON.stringify(this._status.chosenNamespace));
    this.objectEditorStatus.chosenVersionOfType = null;
  }

  private notify(): void {
    if (this._versionStatus.chosenVersion) {
      this.objectEditorStatus.setReFetch(true);
    }
  }
}
