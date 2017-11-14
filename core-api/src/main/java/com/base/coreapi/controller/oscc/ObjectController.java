package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VersionOfType;
import com.base.coreapi.model.oscc.dto.ObjectCreateDTO;
import com.base.coreapi.model.response.SuccessResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Transactional
    @PostMapping("/update")
    public SuccessResponse update(@RequestBody OsccObject object) {
        Version version = object.getVersionOfType().getVersion();
        for (Version v: versionService.getWithAllNext(version)){
            objectService.updateObject(object, v);
        }
        return new SuccessResponse(true);
    }

    @Transactional
    @PostMapping("/delete")
    public SuccessResponse delete(@RequestBody OsccObject object) {
        Version version = object.getVersionOfType().getVersion();
        for (Version v: versionService.getWithAllNext(version)){
            objectService.deleteObject(object, v);
        }
        return new SuccessResponse(true);
    }
}
