package com.base.coreapi.controller;

import com.base.coreapi.controller.microservice.EmailServiceController;
import com.base.coreapi.model.auth.ApplicationUser;
import com.base.coreapi.repository.UserRepository;
import com.base.coreapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import java.security.Principal;

public abstract class API {

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EmailServiceController emailServiceController;

    ApplicationUser getUser(Principal principal){
        return userRepository.findByUsername(principal.getName());
    }

}
