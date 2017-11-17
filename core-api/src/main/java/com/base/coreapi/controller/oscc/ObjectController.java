package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.oscc.*;
import com.base.coreapi.model.oscc.dto.ObjectCreateDTO;
import com.base.coreapi.model.oscc.dto.ObjectDeleteDTO;
import com.base.coreapi.model.oscc.dto.VersionOfTypeWithIds;
import com.base.coreapi.model.response.PreUpdateObjectsResponse;
import com.base.coreapi.model.response.SuccessResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/oscc/objects")
public class ObjectController extends AbstractOSCCAPI {

    @GetMapping("/all")
    public List<OsccObject> getAll(
            @RequestParam Long namespaceSystemId, @RequestParam Long versionSystemId){
        return objectService.findAll(namespaceSystemId, versionSystemId);
    }

    @Transactional
    @PostMapping("/create")
    public SuccessResponse create(@RequestBody ObjectCreateDTO dto) {
        VersionOfType versionOfType = versionOfTypeService.findById(dto.getVersionOfTypeSystemId());
        OsccType type = versionOfType.getType();
        Version version = versionOfType.getVersion();
        for (Version v: versionService.getWithAllNext(version)){
            objectService.createObject(
                    dto.getId(), dto.getSerializedData(), v, type);
        }
        return new SuccessResponse(true);
    }

    @GetMapping("/preupdate")
    public PreUpdateObjectsResponse preUpdate(
            @RequestParam String objectId, @RequestParam Long namespaceSystemId, @RequestParam Long versionSystemId) {
        PreUpdateObjectsResponse response = new PreUpdateObjectsResponse();
        OsccNamespace namespace = namespaceService.findById(namespaceSystemId);
        Version version = versionService.findById(versionSystemId);
        List<Version> versions = versionService.getWithAllNext(version);
        List<OsccObject> objects = new ArrayList<>();
        List<VersionOfTypeWithIds> versionOfTypeWithIds = new ArrayList<>();
        for (Version v: versions) {
            List<VersionOfType> vots = v.getVersionOfTypes().stream().filter(versionOfType ->
                namespace.equals(versionOfType.getType().getNamespace())
            ).collect(Collectors.toList());
            for (VersionOfType vot: vots) {
                VersionOfTypeWithIds toAdd = new VersionOfTypeWithIds();
                toAdd.setVersionOfType(vot);
                toAdd.setIds(vot.getObjects().stream().map(OsccObject::getId).collect(Collectors.toList()));
                versionOfTypeWithIds.add(toAdd);
            }
            objects.add(objectService.findByIdAndVersion(objectId, v));
        }
        response.setObjects(objects);
        response.setVersionOfTypeWithIds(versionOfTypeWithIds);
        return response;
    }

    @Transactional
    @PostMapping("/update")
    public SuccessResponse update(@RequestBody List<OsccObject> objects) {
        objectService.save(objects);
        return new SuccessResponse(true);
    }

    @GetMapping("/predelete")
    public List<OsccObject> preDelete(@RequestParam String id) {
        return objectService.findAllRelated(id);
    }


    @Transactional
    @PostMapping("/delete")
    public SuccessResponse delete(@RequestBody ObjectDeleteDTO dto) {
        objectService.save(dto.getToUpdate());
        objectService.delete(dto.getToDelete());
        return new SuccessResponse(true);
    }
}
