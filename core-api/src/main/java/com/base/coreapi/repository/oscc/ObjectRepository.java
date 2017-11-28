package com.base.coreapi.repository.oscc;

import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ObjectRepository extends JpaRepository<OsccObject, Long> {

    List<OsccObject> findByVersionOfType_Version_SystemIdAndVersionOfType_Type_Namespace_SystemId(Long versionId, Long namespaceId);

    OsccObject findBySystemId(Long systemId);

    OsccObject findByIdAndVersionOfType_Version_SystemId(String objectId, Long versionId);

    OsccObject findByIdAndVersionOfType_Version(String id, Version version);

    List<OsccObject> findBySerializedDataContainingAndVersionOfType_Version_OrderInBundleGreaterThanEqual(String id, Integer orderInBundle);
}
