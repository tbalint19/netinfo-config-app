import {Injectable} from "@angular/core";
import {TypeCreateDto} from "../model/post-request/type-create-dto.model";
import {StructureCreator} from "../model/structure-creator.model";
import {Namespace} from "../model/namespace.model";
import {ObjectCreateDto} from "../model/post-request/object-create-dto.model";
import {ObjectCreator} from "../model/object-creator.model";
import {OsccObject} from "../model/object-model";

@Injectable()
export class DtoFactory {

  createTypeCreateDto(creator: StructureCreator, namespace: Namespace): TypeCreateDto {
    let typeCreateDto = new TypeCreateDto();
    let structure = {};
    structure[creator.type.name] = creator.structure;
    typeCreateDto.structure = JSON.stringify(structure);
    typeCreateDto.type = creator.type;
    typeCreateDto.namespaceId = creator.isCommon ? null : namespace.systemId;
    return typeCreateDto;
  }

  createObjectCreateDto(creator: ObjectCreator): ObjectCreateDto {
    let objectCreateDto = new ObjectCreateDto();
    objectCreateDto.serializedData = JSON.stringify(creator.data);
    objectCreateDto.versionOfTypeSystemId = creator.versionOfType.systemId;
    objectCreateDto.id = creator.data['id'];
    return objectCreateDto;
  }

  createObject(creator: ObjectCreator): OsccObject {
    let object = new OsccObject();
    object.id = creator.data['id'];
    object.systemId = creator.systemId;
    object.serializedData = JSON.stringify(creator.data);
    object.versionOfType = creator.versionOfType;
    return object;
  }
}