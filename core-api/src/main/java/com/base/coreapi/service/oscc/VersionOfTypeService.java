package com.base.coreapi.service.oscc;

import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VersionOfType;
import com.base.coreapi.repository.oscc.VersionOfTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VersionOfTypeService {

    @Autowired
    private VersionOfTypeRepository repository;

    @Autowired
    private VersionService versionService;

    public VersionOfType copyForVersion(VersionOfType vot, Version version) {
        VersionOfType newVersionOfType = new VersionOfType();
        newVersionOfType.setStructure(vot.getStructure());
        newVersionOfType.setType(vot.getType());
        newVersionOfType.setVersion(version);
        repository.save(newVersionOfType);
        return newVersionOfType;
    }

    public VersionOfType findByTypeAndVersion(Long typeId, Long versionId) {
        return repository.findByType_SystemIdAndVersion_SystemId(typeId, versionId);
    }

    public VersionOfType findById(Long systemId){
        return repository.findBySystemId(systemId);
    }

    public void save(VersionOfType versionOfType) {
        repository.save(versionOfType);
    }

    public void createStructure(String structure, OsccType type) {
        for (Version version: versionService.findAll()) {
            VersionOfType versionOfType = new VersionOfType();
            versionOfType.setVersion(version);
            versionOfType.setType(type);
            versionOfType.setStructure(structure);
            save(versionOfType);
        }
    }

    public void save(List<VersionOfType> versionOfTypes) {
        repository.save(versionOfTypes);
    }
}
