package com.base.coreapi.controller;


import com.base.coreapi.model.ApplicationUser;
import com.base.coreapi.model.Confirmation;
import com.base.coreapi.model.Reset;
import com.base.coreapi.model.request.ConfirmRequest;
import com.base.coreapi.model.request.ResetRequest;
import com.base.coreapi.model.response.CheckResponse;
import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.response.TokenResponse;
import com.base.coreapi.controller.microservice.EmailServiceController;
import com.base.coreapi.repository.UserRepository;
import com.base.coreapi.service.ConfirmationService;
import com.base.coreapi.service.ResetService;
import com.base.coreapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
public class UserController extends API {

    @GetMapping("/me")
    public ApplicationUser getMe(Principal principal){
        ApplicationUser user = getUser(principal);
        return user;
    }

}
