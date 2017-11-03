import {Component, Input, OnInit} from '@angular/core';
import {Namespace} from "../../model/namespace.model";
import {NamespaceService} from "../../service/namespace.service";
import {SuccessResponse} from "../../model/response/success-response.model";
import {MessageService} from "../../service/message.service";
import {Error} from "../../model/message/error.model";
import {Success} from "../../model/message/success.model";
import {NamespaceStatus} from "../../status/namespace-status";

@Component({
  selector: 'namespace-selector',
  templateUrl: './namespace-selector.component.html',
  styleUrls: ['./namespace-selector.component.css']
})
export class NamespaceSelectorComponent implements OnInit {

  constructor(
      private nameSpaceService: NamespaceService,
      private messages: MessageService) {
  }

  ngOnInit() {
      this.updateNamespaces();
  }

  @Input()
  public status: NamespaceStatus;

  private updateNamespaces(): void {
      this.nameSpaceService.getNamespaces().subscribe(
          (namespaces: Namespace[]) => this.status.namespaces = namespaces
      );
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

}
