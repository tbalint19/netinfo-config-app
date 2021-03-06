import { BrowserModule } from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import {RoutingModule} from './app.routing';
import {AuthGuard} from './guard/auth.guard';
import { StartComponent } from './component/start/start.component';
import {ConfirmGuard} from './guard/confirm.guard';
import {ConfirmComponent} from './component/confirm/confirm.component';
import {SignupService} from './service/signup.service';
import {LoginService} from './service/login.service';
import {HttpClient} from './http/http.client';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {ConfirmService} from './service/confirm.service';
import { ResetComponent } from './component/reset/reset.component';
import {ResetService} from "./service/reset.service";
import { MessagesComponent } from './component/messages/messages.component';
import {MessageService} from "./service/message.service";
import {UsernameValidator} from "./validator/username-validator";
import {RequestFactory} from "./factory/request-factory";
import {SignupStatus} from "./status/signup-status";
import {EmailValidator} from "./validator/email-validator";
import {PasswordValidator} from "./validator/password-validator";
import { SignupUsernameInputComponent } from './component/signup-username-input/signup-username-input.component';
import { InputInfoComponent } from './component/input-info/input-info.component';
import { SignupEmailInputComponent } from './component/signup-email-input/signup-email-input.component';
import {SignupPasswordInputComponent} from "./component/signup-password-input/signup-password-input.component";
import { SignupPasswordAgainInputComponent } from './component/signup-password-again-input/signup-password-again-input.component';
import { SignupButtonComponent } from './component/signup-button/signup-button.component';
import { WelcomeContentComponent } from './component/welcome-content/welcome-content.component';
import { LoginNavbarComponent } from './component/login-navbar/login-navbar.component';
import {LoginStatus} from "./status/login-status";
import {CredentialValidator} from "./validator/credential-validator";
import { NavbarLogoComponent } from './component/navbar-logo/navbar-logo.component';
import { ResetPopupComponent } from './component/reset-popup/reset-popup.component';
import {ResetStartStatus} from "./status/reset-start-status";
import { MenuNavbarComponent } from './component/menu-navbar/menu-navbar.component';
import { InfoNavbarComponent } from './component/info-navbar/info-navbar.component';
import {ResetStatus} from "./status/reset-status";
import {ResetCodeValidator} from "./validator/reset-code-validator";
import {ConfirmStatus} from "./status/confirm-status";
import {ConfirmCodeValidator} from "./validator/confirm-code-validator";
import { NamespaceSelectorComponent } from './component/namespace-selector/namespace-selector.component';
import {NamespaceService} from "./service/namespace.service";
import {NamespaceStatus} from "./status/namespace-status";
import {NamespaceValidator} from "./validator/namespace-validator";
import { VersionSelectorComponent } from './component/version-selector/version-selector.component';
import {VersionStatus} from "./status/version-status";
import {VersionValidator} from "./validator/version-validator";
import {VersionService} from "./service/version.service";
import {StructurePopupComponent } from './component/structure-popup/structure-popup.component';
import {StructureStatus} from "./status/structure-status";
import { ObjectEditorComponent } from './component/object-editor/object-editor.component';
import {StructureSelectorComponent} from "./component/structure-selector/structure-selector.component";
import { StructureEditorComponent } from './component/structure-editor/structure-editor.component';
import {StructureService} from "./service/structure.service";
import { StructureManagerComponent } from './component/structure-manager/structure-manager.component';
import {PopupStatus} from "./status/popup-status";
import {ObjectEditorStatus} from "./status/object-editor-status";
import {KeyPipe} from './pipe/key.pipe';
import {DtoFactory} from "./factory/dto-factory";
import {ObjectService} from "./service/object.service";
import { ObjectListComponent } from './component/object-list/object-list.component';
import { ObjectPopupComponent } from './component/object-popup/object-popup.component';
import {StructureValidator} from "./validator/structure-validator";
import {CreatorFactory} from "./factory/creator-factory.service";
import { StructureRefactorComponent } from './component/structure-refactor/structure-refactor.component';
import {RenderService} from "./service/render.service";
import {ObjectValidator} from "./validator/object-validator";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DataTableModule, SharedModule} from "primeng/primeng";
import { EscapeDirective } from './directive/escape.directive';
import { EnterDirective } from './directive/enter.directive';
import { ConfirmationModalComponent } from './component/confirmation-modal/confirmation-modal.component';
import {ConfirmModalStatus} from "./status/confirm-modal-status";
import { ObjectInfoComponent } from './component/object-info/object-info.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StartComponent,
    ConfirmComponent,
    ResetComponent,
    MessagesComponent,
    SignupUsernameInputComponent,
    InputInfoComponent,
    SignupEmailInputComponent,
    SignupPasswordInputComponent,
    SignupPasswordAgainInputComponent,
    SignupButtonComponent,
    WelcomeContentComponent,
    LoginNavbarComponent,
    NavbarLogoComponent,
    ResetPopupComponent,
    MenuNavbarComponent,
    InfoNavbarComponent,
    NamespaceSelectorComponent,
    VersionSelectorComponent,
    StructurePopupComponent,
    ObjectEditorComponent,
    StructureSelectorComponent,
    StructureEditorComponent,
    StructureManagerComponent,
    KeyPipe,
    ObjectListComponent,
    ObjectPopupComponent,
    StructureRefactorComponent,
    EscapeDirective,
    EnterDirective,
    ConfirmationModalComponent,
    ObjectInfoComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    HttpModule,
    FormsModule,
    BrowserAnimationsModule,
    DataTableModule,
    SharedModule,
  ],
  providers: [
    AuthGuard,
    ConfirmGuard,
    HttpClient,
    SignupService,
    LoginService,
    ResetService,
    MessageService,
    NamespaceService,
    UsernameValidator,
    EmailValidator,
    CredentialValidator,
    PasswordValidator,
    RequestFactory,
    SignupStatus,
    LoginStatus,
    NamespaceStatus,
    NamespaceValidator,
    ResetStartStatus,
    ResetStatus,
    ResetCodeValidator,
    VersionStatus,
    VersionValidator,
    VersionService,
    StructureStatus,
    StructureService,
    RenderService,
    ConfirmService,
    ConfirmStatus,
    PopupStatus,
    ObjectEditorStatus,
    ConfirmCodeValidator,
    DtoFactory,
    ObjectService,
    StructureValidator,
    CreatorFactory,
    ObjectValidator,
    ConfirmModalStatus
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
