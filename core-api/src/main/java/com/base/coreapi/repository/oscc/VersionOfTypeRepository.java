package com.base.coreapi.repository.oscc;

import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.VersionOfType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VersionOfTypeRepository extends JpaRepository<VersionOfType, Long> {

    VersionOfType findByType_SystemIdAndVersion_SystemId(Long typeId, Long versionId);

    VersionOfType findBySystemId(Long systemId);
}
