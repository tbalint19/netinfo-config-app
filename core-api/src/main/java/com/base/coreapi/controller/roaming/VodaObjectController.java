package com.base.coreapi.controller.roaming;

import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.roaming.Version;
import com.base.coreapi.model.roaming.VodaObject;
import com.base.coreapi.repository.VersionRepository;
import com.base.coreapi.repository.VodaObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/roaming/objects")
public class VodaObjectController {

    @Autowired
    private VersionRepository versionRepository;

    @Autowired
    private VodaObjectRepository vodaObjectRepository;

    @GetMapping("/all/{versionId}")
    public List<VodaObject> getAllForVersion(@PathVariable Long versionId) {
        Version version = versionRepository.findBySystemId(versionId);
        return version.getObjects();
    }

    @GetMapping("/allupper/{orderInBundle}")
    public  List<VodaObject> getAllAndUpperForVersion(@PathVariable Integer orderInBundle) {
        List<Version> versions = versionRepository.findByOrderInBundleGreaterThanEqual(orderInBundle);
        List<VodaObject> objects = new ArrayList<>();
        for (Version version: versions) {
            objects.addAll(version.getObjects());
        }
        return objects;
    }

    @PostMapping("/create")
    public SuccessResponse createObject(@RequestBody VodaObject vodaObject){
        vodaObjectRepository.save(vodaObject);
        Version v = versionRepository.findBySystemId(vodaObject.getVersionSystemId());
        List<Version> versions = versionRepository.findByOrderInBundleGreaterThanEqual(v.getOrderInBundle());
        for (Version version : versions) {
            VodaObject newObj = new VodaObject();
            newObj.setId(vodaObject.getId());
            newObj.setObjectType(vodaObject.getObjectType());
            newObj.setVersionSystemId(version.getSystemId());
            newObj.setSerializedData(vodaObject.getSerializedData());
            vodaObjectRepository.save(newObj);        }
        return new SuccessResponse(true);
    }

    @PostMapping("/update")
    @Transactional
    public SuccessResponse updateObject(@RequestBody VodaObject vodaObject){
        vodaObjectRepository.save(vodaObject);
        Version version = versionRepository.findBySystemId(vodaObject.getVersionSystemId());
        List<Version> versions = versionRepository
                .findByOrderInBundleGreaterThanEqual(version.getOrderInBundle());
        for (Version v : versions){
            VodaObject obj = vodaObjectRepository
                    .findByVersionSystemIdAndId(v.getSystemId(), vodaObject.getId());
            obj.setSerializedData(vodaObject.getSerializedData());
            vodaObjectRepository.save(obj);
        }
        return new SuccessResponse(true);
    }

    @PostMapping("/delete")
    public SuccessResponse deleteObject(@RequestBody VodaObject vodaObject){
        vodaObjectRepository.delete(vodaObject.getSystemId());
        Version version = versionRepository.findBySystemId(vodaObject.getVersionSystemId());
        List<Version> versions = versionRepository
                .findByOrderInBundleGreaterThanEqual(version.getOrderInBundle());
        for (Version v: versions){
            VodaObject obj = vodaObjectRepository
                    .findByVersionSystemIdAndId(v.getSystemId(), vodaObject.getId());
            vodaObjectRepository.delete(obj.getSystemId());
        }
        return new SuccessResponse(true);
    }
}
