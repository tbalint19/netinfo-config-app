package com.base.coreapi.repository.oscc;

import com.base.coreapi.model.oscc.VodaObject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VodaObjectRepository extends JpaRepository<VodaObject, Long> {

    VodaObject findByVersionSystemIdAndId(Long vId, String id);
}
