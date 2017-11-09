package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.oscc.*;
import com.base.coreapi.model.oscc.dto.VersionOfTypeUpdateDTO;
import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.service.oscc.NamespaceService;
import com.base.coreapi.service.oscc.TypeService;
import com.base.coreapi.service.oscc.VersionOfTypeService;
import com.base.coreapi.service.oscc.VersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/oscc/versionoftype")
public class VersionOfTypeController extends AbstractOSCCAPI {

    @GetMapping("/all")
    public List<VersionOfType> getAll(@RequestParam Long namespaceId, @RequestParam Long versionId){
        List<VersionOfType> versionOfTypes = new ArrayList<>();
        for (OsccType type: typeService.findAll(namespaceId)) {
            versionOfTypes.add(versionOfTypeService.findByTypeAndVersion(type.getSystemId(), versionId));
        }
        return versionOfTypes;
    }

    @GetMapping("/preupdate")
    public VersionOfTypeUpdateDTO preUpdate(@RequestParam Long versionOfTypeId){
        VersionOfTypeUpdateDTO response = new VersionOfTypeUpdateDTO();

        VersionOfType versionOfType = versionOfTypeService.findById(versionOfTypeId);
        List<Version> versions = new ArrayList<>();
        versions.add(versionOfType.getVersion());
        versions.addAll(versionService.getAllNext(versionOfType.getVersion()));

        List<VersionOfType> versionOfTypes = new ArrayList<>();
        List<OsccObject> objects = new ArrayList<>();

        for (Version v: versions){
            VersionOfType vot = versionOfTypeService.findByTypeAndVersion(
                                    versionOfType.getType().getSystemId(), v.getSystemId());
            objects.addAll(vot.getObjects());
            versionOfTypes.add(vot);
        }

        response.setVersionOfTypes(versionOfTypes);
        response.setObjects(objects);

        return response;
    }

    @Transactional
    @PostMapping("/update")
    public SuccessResponse update(@RequestBody VersionOfTypeUpdateDTO dto) {
        versionOfTypeService.save(dto.getVersionOfTypes());
        objectService.save(dto.getObjects());
        return new SuccessResponse(true);
    }

}
