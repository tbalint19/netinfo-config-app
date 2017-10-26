package com.base.coreapi.service.oscc;

import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VodaObject;
import com.base.coreapi.repository.oscc.VodaObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VodaObjectService {

    @Autowired
    private VodaObjectRepository repository;

    @Autowired
    private VersionService versionService;

    public void copyForVersion(VodaObject vodaObject, Version version){
        VodaObject newObj = new VodaObject();
        newObj.setId(vodaObject.getId());
        newObj.setObjectType(vodaObject.getObjectType());
        newObj.setSerializedData(vodaObject.getSerializedData());
        newObj.setVersion(version);
        repository.save(newObj);
    }

    public void createForAllUpperVersions(VodaObject vodaObject){
        repository.save(vodaObject);
        List<Version> versions = versionService.getAllUpper(vodaObject.getVersion());
        versions.forEach(version -> copyForVersion(vodaObject, version));
    }

    public VodaObject findOtherVersion(VodaObject object, Version version){
        return repository
                .findByVersionSystemIdAndId(
                        version.getSystemId(), object.getId());
    }

    public void updateForAllUpperVersions(VodaObject vodaObject) {
        repository.save(vodaObject);
        for (Version version : versionService.getAllUpper(vodaObject.getVersion())){
            VodaObject obj = findOtherVersion(vodaObject, version);
            obj.setSerializedData(vodaObject.getSerializedData());
            repository.save(obj);
        }
    }

    public void deleteForAllUpperVersions(VodaObject vodaObject) {
        repository.delete(vodaObject.getSystemId());
        for (Version version : versionService.getAllUpper(vodaObject.getVersion())){
            VodaObject obj = findOtherVersion(vodaObject, version);
            repository.delete(obj.getSystemId());
        }
    }

    public void save(List<VodaObject> vodaObjects){
        repository.save(vodaObjects);
    }
}
