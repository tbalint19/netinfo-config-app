import {Injectable} from "@angular/core";
import {TypeCreateDto} from "../model/post-request/type-create-dto.model";
import {StructureCreator} from "../model/structure-creator.model";
import {Namespace} from "../model/namespace.model";

@Injectable()
export class DtoFactory {

  createTypeCreateDto(creator: StructureCreator, namespace: Namespace): TypeCreateDto {
    let typeCreateDto = new TypeCreateDto();
    console.log(creator);
    typeCreateDto.structure = JSON.stringify(creator.structure);
    typeCreateDto.type = creator.type;
    typeCreateDto.namespaceId = creator.isCommon ? null : namespace.systemId;
    console.log(typeCreateDto);
    return typeCreateDto;
  }
}