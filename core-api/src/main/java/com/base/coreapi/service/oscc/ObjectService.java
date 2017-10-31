package com.base.coreapi.service.oscc;

import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.VersionOfType;
import com.base.coreapi.repository.oscc.ObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ObjectService {

    @Autowired
    private ObjectRepository repository;

    @Autowired
    private VersionOfTypeService versionOfTypeService;

    public OsccObject copyForVersionofType(OsccObject object, VersionOfType vot) {
        OsccObject newObject = new OsccObject();
        newObject.setId(object.getId());
        newObject.setSerializedData(object.getSerializedData());
        newObject.setVersionOfType(vot);
        return save(newObject);
    }

    public List<OsccObject> findAll(Long namespaceId, Long versionId){
        return repository
                .findByVersionOfType_Version_SystemIdAndVersionOfType_Type_Namespace_SystemId(
                        versionId, namespaceId
                );
    }

    public void createObject(String id, String serializedData, Version v, OsccType t) {
        OsccObject object = new OsccObject();
        object.setId(id);
        object.setSerializedData(serializedData);
        VersionOfType versionOfType = versionOfTypeService.findByTypeAndVersion(t.getSystemId(), v.getSystemId());
        object.setVersionOfType(versionOfType);
        save(object);
    }

    public OsccObject findById(Long systemId) {
        return repository.findBySystemId(systemId);
    }

    public void updateObject(OsccObject o, Version v) {
        OsccObject object = repository.findByIdAndVersionOfType_Version_SystemId(o.getId(), v.getSystemId());
        object.setSerializedData(o.getSerializedData());
        save(object);
    }

    public void deleteObject(OsccObject o, Version v) {
        OsccObject object = repository.findByIdAndVersionOfType_Version_SystemId(o.getId(), v.getSystemId());
        delete(object);
    }

    private OsccObject save(OsccObject object){
        repository.save(object);
        return object;
    }

    private void delete(OsccObject object){
        repository.delete(object);
    }

    public void save(List<OsccObject> objects) {
        repository.save(objects);
    }
}
