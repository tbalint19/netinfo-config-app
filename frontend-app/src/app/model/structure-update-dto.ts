import {VersionOfType} from "./version-of-type.model";
import {OsccObject} from "./object-model";

export class StructureUpdateDto {

  public versionOfTypes: VersionOfType[];

  public objects: OsccObject[];

  constructor(objects: OsccObject[], versionOfTypes: VersionOfType[]){
    this.objects = objects;
    this.versionOfTypes = versionOfTypes;
  }
}
