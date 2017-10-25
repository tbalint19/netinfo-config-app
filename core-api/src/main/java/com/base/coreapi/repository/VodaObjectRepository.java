package com.base.coreapi.repository;

import com.base.coreapi.model.roaming.Version;
import com.base.coreapi.model.roaming.VodaObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VodaObjectRepository extends JpaRepository<VodaObject, Long> {

    VodaObject findByVersionSystemIdAndId(Long vId, String id);
}
