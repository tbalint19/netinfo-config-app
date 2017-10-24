package com.base.coreapi.controller;

import com.base.coreapi.model.ApplicationUser;
import com.base.coreapi.model.Confirmation;
import com.base.coreapi.model.request.LoginRequest;
import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.response.TokenResponse;
import com.base.coreapi.service.ConfirmationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController extends API {

    @Autowired
    private ConfirmationService confirmationService;

    @PostMapping("/signup")
    public SuccessResponse signupUser(@RequestBody ApplicationUser user){
        Confirmation confirmation = confirmationService.createConfirmation();
        ApplicationUser createdUser = userService.createUser(user, confirmation);
        emailServiceController.sendConfirmationEmail(user);
        return new SuccessResponse(createdUser != null);
    }

    @PostMapping("/login")
    public TokenResponse loginUser(@RequestBody LoginRequest request){
        ApplicationUser user = userService.getUserByCredential(request.getCredential());
        String token = userService.loginUser(user, request.getPassword());
        return new TokenResponse(token);
    }

}
