package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VodaObject;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roaming/objects")
public class VodaObjectController extends OSCCAPI {

    @GetMapping("/all/{versionId}")
    public List<VodaObject> getAllForVersion(@PathVariable Long versionId) {
        Version version = versionService.findBySystemId(versionId);
        return version.getObjects();
    }

    @Transactional
    @PostMapping("/create")
    public SuccessResponse createObject(@RequestBody VodaObject vodaObject){
        vodaObjectService.createForAllUpperVersions(vodaObject);
        return new SuccessResponse(true);
    }

    @Transactional
    @PostMapping("/update")
    public SuccessResponse updateObject(@RequestBody VodaObject vodaObject){
        vodaObjectService.updateForAllUpperVersions(vodaObject);
        return new SuccessResponse(true);
    }

    @Transactional
    @PostMapping("/delete")
    public SuccessResponse deleteObject(@RequestBody VodaObject vodaObject){
        vodaObjectService.deleteForAllUpperVersions(vodaObject);
        return new SuccessResponse(true);
    }
}
