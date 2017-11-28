import {HttpRequest} from "../model/http-request.model";
import {Injectable} from "@angular/core";
import {SignupUser} from "../model/post-request/signup-user.model";
import {LoginUser} from "../model/post-request/login-user.model";
import {Confirmation} from "../model/post-request/confirmation.model";
import {Reset} from "../model/post-request/reset.model";
import {ResetEmailParams} from "../model/get-request/reset-email-params.model";
import {ConfirmEmailParams} from "../model/get-request/confirm-email-params.model";
import {CheckUsernameParams} from "../model/get-request/check-username-params.model";
import {CheckEmailParams} from "../model/get-request/check-email-params.model";
import {Namespace} from "../model/namespace.model";
import {Version} from "../model/version.model";
import {StructureParams} from "../model/get-request/structure-params.model";
import {TypeCreateDto} from "../model/post-request/type-create-dto.model";
import {ObjectParams} from "../model/get-request/object-params.model";
import {ObjectCreateDto} from "../model/post-request/object-create-dto.model";
import {OsccObject} from "../model/object-model";
import {PreUpdateObjectsParams} from "../model/get-request/pre-update-objects-params";
import {StructureUpdateDto} from "../model/structure-update-dto";

@Injectable()
export class RequestFactory {

  public createUsernameCheckRequest(params: CheckUsernameParams): HttpRequest {
    return new HttpRequest("/api/check/username", "GET", params);
  }

  public createEmailCheckRequest(params: CheckEmailParams): HttpRequest {
    return new HttpRequest("/api/check/email", "GET", params);
  }

  public createPreUpdateObjectsRequest(params: PreUpdateObjectsParams): HttpRequest {
    return new HttpRequest("/api/oscc/objects/preupdate", "GET", params);
  }

  public createSignupRequest(user: SignupUser): HttpRequest {
    return new HttpRequest("/api/auth/signup", "POST", user);
  }

  public createLoginRequest(user: LoginUser): HttpRequest {
    return new HttpRequest("/api/auth/login", "POST", user);
  }

  public createConfirmEmailRequest(params: ConfirmEmailParams): HttpRequest {
    return new HttpRequest("/api/confirm/start", "GET", params);
  }

  public createConfirmRequest(confirmation: Confirmation): HttpRequest {
    return new HttpRequest("/api/confirm/finish", "POST", confirmation);
  }

  public createResetEmailRequest(params: ResetEmailParams): HttpRequest{
    return new HttpRequest("/api/reset/start", "GET", params);
  }

  public createResetRequest(reset: Reset): HttpRequest{
    return new HttpRequest("/api/reset/finish", "POST", reset);
  }

  public createGetNamespacesRequest(): HttpRequest {
    return new HttpRequest("/api/oscc/namespace/all", "GET", null);
  }

  public createNamespaceCreateRequest(namespace: Namespace): HttpRequest {
    return new HttpRequest("/api/oscc/namespace/create", "POST", namespace);
  }

  public createGetVersionRequest(): HttpRequest {
    return new HttpRequest("/api/oscc/version/all", "GET", null);
  }

  public createVersionCreateRequest(version: Version): HttpRequest {
    return new HttpRequest("/api/oscc/version/create", "POST", version);
  }

  public createGetStructuresRequest(params: StructureParams): HttpRequest {
    return new HttpRequest("/api/oscc/versionoftype/all", "GET", params);
  }

  public createStructureCreateRequest(dto: TypeCreateDto): HttpRequest {
    return new HttpRequest('/api/oscc/type/create', 'POST', dto);
  }

  public createGetObjectsRequest(params: ObjectParams): HttpRequest {
    return new HttpRequest('/api/oscc/objects/all', 'GET', params);
  }

  public createSaveObjectsRequest(dto: ObjectCreateDto): HttpRequest {
    return new HttpRequest('/api/oscc/objects/create', 'POST', dto);
  }

  public createUpdateObjectRequest(objects: OsccObject[]): HttpRequest {
    return new HttpRequest('/api/oscc/objects/update', 'POST', objects);
  }

  public createDeleteObjectRequest(toDelete: OsccObject[], toUpdate: OsccObject[]): HttpRequest {
    return new HttpRequest('/api/oscc/objects/delete', 'POST', {toDelete, toUpdate});
  }

  public createPreDeleteObjectRequest(id: string, versionId: number): HttpRequest {
    return new HttpRequest('/api/oscc/objects/predelete', 'GET', {id, versionId});
  }

  public createPreStructureUpdateRequest(versionId: number, typeId: number): HttpRequest {
    return new HttpRequest("/api/oscc/versionoftype/preupdate", "GET", {versionId, typeId});
  }

  public createStructureUpdateRequest(dto: StructureUpdateDto): HttpRequest {
    return new HttpRequest("/api/oscc/versionoftype/update", "POST", dto);
  }

  public createPreRenderRequest(param: { versionId: number; namespaceId: number }): HttpRequest {
    return new HttpRequest("/api/oscc/objects/prerender", "GET", param);
  }
}
