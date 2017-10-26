package com.base.coreapi.service.oscc;

import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VodaObject;
import com.base.coreapi.model.oscc.enums.OrderDirections;
import com.base.coreapi.repository.oscc.VersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class VersionService {

    @Autowired
    private VersionRepository repository;

    @Autowired
    private VodaObjectService vodaObjectService;

    public List<Version> getAllUpper(Version version){
        Integer orderInBundle = version.getOrderInBundle();
        return repository.findByOrderInBundleGreaterThanEqual(orderInBundle);
    }

    public List<Version> getAllUpper(Integer orderInBundle){
        return repository.findByOrderInBundleGreaterThanEqual(orderInBundle);
    }

    public void updateStructureForAllUpperVersions(Version version){
        repository.save(version);
        for (Version v: getAllUpper(version)){
            v.setSerializedObjects(version.getSerializedObjects());
            repository.save(v);
        }
    }

    private Version getPrevious(Version version){
        return repository
                .findByOrderInBundle(version.getOrderInBundle() - 1);
    }

    public void createVersionWithInitialObjects(Version version){
        repository.save(version);
        createInitialObjects(getPrevious(version));
    }

    private void createInitialObjects(Version previousVersion){
        if (previousVersion != null) {
            List<VodaObject> previousObjects = previousVersion.getObjects();
            for (VodaObject obj: previousObjects){
                vodaObjectService.copyForVersion(obj, previousVersion);
            }
        }
    }

    public void deleteWithRelatedObjects(Version version){
        repository.delete(version.getSystemId());
    }

    public void reOrderVersions(Version version, OrderDirections direction){
        Integer value = direction == OrderDirections.UP ? 1 : -1;
        for (Version v: getAllUpper(version)){
            v.setOrderInBundle(v.getOrderInBundle() + value);
            repository.save(v);
        }
    }

    public List<VodaObject> getAllRelatedObjects(List<Version> versions) {
        List<VodaObject> objects = new ArrayList<>();
        versions.stream().map(Version::getObjects).forEach(objects::addAll);
        return objects;
    }

    public void save(Version version){
        repository.save(version);
    }

    public List<Version> findAll(){
        return repository.findAll();
    }

    public Version findBySystemId(Long id){
        return repository.findBySystemId(id);
    }
}
