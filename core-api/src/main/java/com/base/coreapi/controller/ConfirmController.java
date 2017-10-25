package com.base.coreapi.controller;


import com.base.coreapi.model.auth.ApplicationUser;
import com.base.coreapi.model.request.ConfirmRequest;
import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.response.TokenResponse;
import com.base.coreapi.service.ConfirmationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/confirm")
public class ConfirmController extends API {

    @Autowired
    private ConfirmationService confirmationService;

    @GetMapping("/start")
    public SuccessResponse start(@RequestParam String username){
        ApplicationUser user = userRepository.findByUsername(username);
        Boolean canSend = user != null && !user.getConfirmed();
        if (canSend){
            emailServiceController.sendConfirmationEmail(user);
        }
        return new SuccessResponse(canSend);
    }

    @PostMapping("/finish")
    public TokenResponse finish(@RequestBody ConfirmRequest request){
        String token = confirmationService.attemptConfirm(
                request.getCredential(), request.getCode());
        return new TokenResponse(token);
    }
}
