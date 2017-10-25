package com.base.coreapi.repository;

import com.base.coreapi.model.auth.Confirmation;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConfirmationRepository extends CrudRepository<Confirmation, Long> {

}
