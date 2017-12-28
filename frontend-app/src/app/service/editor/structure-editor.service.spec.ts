import { StructureEditorService } from './structure-editor.service';
import {VersionOfType} from "../../model/version-of-type.model";
import {Type} from "../../model/type.model";
import {Namespace} from "../../model/namespace.model";
import {Version} from "../../model/version.model";

describe('StructureEditorService', () => {
  const versionOfType = new VersionOfType();

  beforeEach(() => {
    let type = new Type();
    let namespace = new Namespace();
    let version = new Version();

    version.systemId = 0;
    version.name = "2018 marc";
    version.number = "1.0.0";
    version.orderInBundle = 1;

    namespace.systemId = 1;
    namespace.name = "pre";

    type.systemId = 2;
    type.name = "offer";
    type.complex = true;
    type.namespace = namespace;

    versionOfType.systemId = 3;
    versionOfType.type = type;
    versionOfType.version = version;

  });

  it("should update empty object with one KV pair updates structure", () => {
    let structure = {"name": "string"};
    versionOfType.structure = JSON.stringify(structure);

    let newStructure = {};
    let service = new StructureEditorService(newStructure);
    let result = service.updateVersionOfTypeWhenDelete(versionOfType);

    let resultStructure = JSON.parse(result.structure)["offer"];
    expect(resultStructure["name"]).toBe(undefined);
  });

  it("should update empty object with one KV pair not modifies Id", () => {
    let structure = {"name": "string"};
    versionOfType.structure = JSON.stringify(structure);

    let newStructure = {};
    let service = new StructureEditorService(newStructure);
    let result = service.updateVersionOfTypeWhenDelete(versionOfType);

    expect(result.systemId).toBe(versionOfType.systemId);
  });

  it("should update empty object with one KV pair not modifies Type", () => {
    let structure = {"name": "string"};
    versionOfType.structure = JSON.stringify(structure);

    let newStructure = {};
    let service = new StructureEditorService(newStructure);
    let result = service.updateVersionOfTypeWhenDelete(versionOfType);

    expect(result.type.systemId).toBe(versionOfType.type.systemId);
  });

  it("should update object with the new structure", () => {
    let structure = {"name": "string", "price": "number"};
    versionOfType.structure = JSON.stringify(structure);

    let newStructure = {"price": "number"};
    let service = new StructureEditorService(newStructure);
    let result = service.updateVersionOfTypeWhenDelete(versionOfType);

    let resultStructure = JSON.parse(result.structure)["offer"];
    expect(resultStructure["name"]).toBe(undefined);
  });

  it("should update object with the new structure", () => {
    let structure = {"name": "string", "price": "number"};
    versionOfType.structure = JSON.stringify(structure);

    let newStructure = {"price": "number"};
    let service = new StructureEditorService(newStructure);
    let result = service.updateVersionOfTypeWhenDelete(versionOfType);

    let resultStructure = JSON.parse(result.structure)["offer"];
    expect(resultStructure["price"]).toBe(newStructure["price"]);
  });

});
