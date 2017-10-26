package com.base.coreapi.repository.auth;

import com.base.coreapi.model.auth.ApplicationUser;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<ApplicationUser, Long> {

    ApplicationUser findByUsername(String username);

    ApplicationUser findByEmail(String email);

    ApplicationUser findByUsernameIgnoreCase(String username);

    ApplicationUser findByEmailIgnoreCase(String email);

//    ApplicationUser findByUsernameOrEmail(String credential);
}
