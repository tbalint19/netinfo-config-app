import {Component, Input, OnInit} from '@angular/core';
import {VersionStatus} from "../../status/version-status";
import {VersionService} from "../../service/version.service";
import {Version} from "../../model/version.model";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Error} from "../../model/message/error.model"
import {Success} from "../../model/message/success.model";
import {ObjectEditorStatus} from "../../status/object-editor-status";
import {NamespaceStatus} from "../../status/namespace-status";
import {ConfirmModalStatus} from "../../status/confirm-modal-status";

@Component({
  selector: 'version-selector',
  templateUrl: './version-selector.component.html',
  styleUrls: ['./version-selector.component.css']
})
export class VersionSelectorComponent implements OnInit {

  constructor(private versionService: VersionService,
              private messages: MessageService,
              protected objectEditorStatus: ObjectEditorStatus,
              private namespaceStatus: NamespaceStatus,
              public confirmModalStatus: ConfirmModalStatus,
              public status: VersionStatus) {
  }

  ngOnInit() {
    this.updateVersions();
  }

  private updateVersions(): void {
    this.versionService.getVersions().subscribe(
      (versions: Version[]) => this.handleVersionUpdate(versions)
    );
  }

  private handleVersionUpdate(versions: Version[]) {
    this.status.versions = versions.sort(this.versionSort);
    if (localStorage.getItem('version')) {
      let versionFromStorage = JSON.parse(localStorage.getItem('version'));
      this.status.chosenVersion = this.status.versions.find(
        (entry) => entry.systemId == versionFromStorage.systemId
      );
      this.notify();
    }
  }

  private versionSort(one: Version, other: Version): number {
    return one.orderInBundle - other.orderInBundle;
  }

  public createVersion(): void {
    if (!this.status.dataIsValid()) {
      this.suspend();
      return;
    }
    this.confirmCreate();
  }

  private confirmCreate(): void {
    this.confirmModalStatus.data = this.status.createdVersion;
    this.confirmModalStatus.chosenSelector = "version";
    this.confirmModalStatus.confirmModalIsShown = true;
  }

  saveVersion(): void {
    this.versionService.createVersion(this.status.createdVersion).subscribe(
      (response: SuccessResponse) => this.handleCreateResponse(response.successful)
    );
  }

  private suspend(): void {
    switch (true) {
      case !this.status.nameIsValid(): {
        this.messages.add(new Error("Invalid data", "Name is invalid"));
        break;
      }
      case !this.status.numberIsValid(): {
        this.messages.add(new Error("Invalid data", "Version is invalid"));
        break;
      }
      case !this.status.orderInBundleIsValid(): {
        this.messages.add(new Error("Invalid data", "No base version"));
        break;
      }
    }
  }

  private handleCreateResponse(successful: boolean): void {
    if (!successful) {
      this.messages.add(new Error("Oooops", "Something happened"));
      return;
    }
    this.messages.add(new Success("Success", "Version created"));
    this.updateVersions();
    this.status.createdVersion.reset();
    this.status.createdVersionsBaseVersion = null;
    this.status.createdVersion.orderInBundle = 1;
  }

  updateCreatedVersion() {
    this.status.createdVersion.orderInBundle = this.status.createdVersionsBaseVersion.orderInBundle + 1;
  }

  protected handleModelChange(): void {
    this.notify();
    localStorage.setItem('version', JSON.stringify(this.status.chosenVersion));
    this.objectEditorStatus.chosenVersionOfType = null;
  }

  private notify(): void {
    if (this.namespaceStatus.chosenNamespace) {
      this.objectEditorStatus.setReFetch(true);
    }
  }

}
