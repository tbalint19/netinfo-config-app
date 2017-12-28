import {VersionOfType} from "../../model/version-of-type.model";
import {OsccObject} from "../../model/object-model";

export class StructureEditorService {

  private newStructure: any;

  constructor(newStructure: any) {
    this.newStructure = newStructure;
  }

  updateVersionOfTypeWhenDelete(original: VersionOfType): VersionOfType {
    let updatedStructure = {};
    let name = original.type.name;
    updatedStructure[name] = this.newStructure;
    original.structure = JSON.stringify(updatedStructure);
    return original;
  }

  updateObjectWhenDelete(original: OsccObject): OsccObject {
    let newData = {};
    let oldData = JSON.parse(original.serializedData);
    for (let key of Object.keys(oldData)){
      if (Object.keys(this.newStructure).includes(key)){
        newData[key] = oldData[key];
      }
    }
    original.serializedData = JSON.stringify(newData);
    return original;
  }

}
