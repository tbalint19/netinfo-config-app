package com.base.coreapi.repository.oscc;

import com.base.coreapi.model.oscc.OsccNamespace;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NamespaceRepository extends JpaRepository<OsccNamespace, Long> {


    OsccNamespace findBySystemId(Long namespaceSystemId);
}
