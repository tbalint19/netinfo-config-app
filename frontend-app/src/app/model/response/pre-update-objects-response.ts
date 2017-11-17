import {OsccObject} from "../object-model";
import {VersionOfTypeWithIds} from "./version-of-type-with-ids";

export class PreUpdateObjectsResponse {

  public objects: OsccObject[];
  public versionOfTypeWithIds: VersionOfTypeWithIds[];
}
