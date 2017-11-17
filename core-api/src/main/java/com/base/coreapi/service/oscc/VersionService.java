package com.base.coreapi.service.oscc;

import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VersionOfType;
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
    private VersionOfTypeService versionOfTypeService;

    @Autowired
    private ObjectService objectService;

    public void createWithObjectsAndStructures(Version version) {
        save(version);
        Version previousVersion = getPrevious(version);
        if (previousVersion != null) {
            copy(previousVersion, version);
        }
    }

    public void reorder(Version version, OrderDirections direction) {
        if (version == null){
            return;
        }
        int value = direction == OrderDirections.UP ? 1 : -1;
        List<Version> versions = getAllNext(version);
        versions.add(version);
        for (Version v : versions) {
            v.setOrderInBundle(v.getOrderInBundle() + value);
            repository.save(v);
        }
    }

    private Version getPrevious(Version version) {
        return repository.findByOrderInBundle(version.getOrderInBundle() - 1);
    }

    public List<Version> getAllNext(Version version) {
        return repository.findByOrderInBundleGreaterThan(version.getOrderInBundle());
    }

    public List<Version> getWithAllNext(Version version){
        List<Version> versions = new ArrayList<>();
        versions.add(version);
        versions.addAll(getAllNext(version));
        return versions;
    }

    private void copy(Version base, Version target) {
        for (VersionOfType vot : base.getVersionOfTypes()) {
            VersionOfType newVersionOfType = versionOfTypeService.copyForVersion(vot, target);
            for (OsccObject obj : vot.getObjects()) {
                objectService.copyForVersionofType(obj, newVersionOfType);
            }
        }
    }

    public List<Version> findAll() {
        return repository.findAll();
    }

    public void save(Version version) {
        repository.save(version);
    }

    public void delete(Version version) {
        repository.delete(version);
    }

    public Version findByOrderInBundle(Integer orderInBundle) {
        return repository.findByOrderInBundle(orderInBundle);
    }

    public Version findById(Long versionSystemId) {
        return repository.findBySystemId(versionSystemId);
    }
}
