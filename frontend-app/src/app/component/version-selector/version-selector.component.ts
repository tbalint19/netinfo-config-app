import {Component, Input, OnInit} from '@angular/core';
import {VersionStatus} from "../../status/version-status";
import {VersionService} from "../../service/version.service";
import {Version} from "../../model/version.model";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Error} from "../../model/message/error.model"
import {Success} from "../../model/message/success.model";

@Component({
  selector: 'version-selector',
  templateUrl: './version-selector.component.html',
  styleUrls: ['./version-selector.component.css']
})
export class VersionSelectorComponent implements OnInit {

  constructor(
    private versionService: VersionService,
    private messages: MessageService) { }

  ngOnInit() {
    this.updateVersions();
  }

  @Input()
  public status: VersionStatus;

  private updateVersions(): void {
    this.versionService.getVersions().subscribe(
      (versions: Version[]) => this.status.versions = versions.sort(
        (one: Version, other: Version) => one.orderInBundle - other.orderInBundle
      )
    );
  }

  public createVersion(): void {
    if (!this.status.dataIsValid()) {
      this.suspend();
      return;
    }
    console.log(this.status.createdVersion);
    this.versionService.createVersion(this.status.createdVersion).subscribe(
      (response: SuccessResponse) => this.handleCreateResponse(response.successful)
    );
  }

  private suspend(): void {
    this.messages.add(new Error("Invalid data", "Version is not created"));
  }

  private handleCreateResponse(successful: boolean): void {
    if (!successful){
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

}
