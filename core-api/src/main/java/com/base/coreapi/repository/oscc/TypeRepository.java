package com.base.coreapi.repository.oscc;

import com.base.coreapi.model.oscc.OsccType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TypeRepository extends JpaRepository<OsccType, Long>{

    List<OsccType> findByNamespace_SystemId(Long id);

    OsccType findBySystemId(Long typeSystemId);
}
