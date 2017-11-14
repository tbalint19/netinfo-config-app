import { Injectable } from '@angular/core';
import {OsccObject} from "../model/object-model";
import {ObjectCreator} from "../model/object-creator.model";
import {VersionOfType} from "../model/version-of-type.model";
import {StructureCreator} from "../model/structure-creator.model";

@Injectable()
export class CreatorFactory {

  constructor() { }


  public createObjectCreator(object?: OsccObject): ObjectCreator {
    if (!object) {
      return new ObjectCreator();
    }
    let creator = new ObjectCreator();
    creator.systemId = object.systemId;
    creator.data = JSON.parse(object.serializedData);
    creator.versionOfType = object.versionOfType;
    return creator;
  }
}
