package com.base.coreapi.controller;


import com.base.coreapi.model.auth.ApplicationUser;
import com.base.coreapi.model.auth.Reset;
import com.base.coreapi.model.request.ResetRequest;
import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.service.AuthService;
import com.base.coreapi.service.ResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reset")
public class ResetController extends API {
    @Autowired
    private ResetService resetService;

    @Autowired
    private AuthService authService;

    @GetMapping("/start")
    public SuccessResponse startProcess(@RequestParam String credential){
        ApplicationUser user = userService.getUserByCredential(credential);
        if (user != null){
            Reset reset = resetService.createReset(user);
            emailServiceController.sendResetEmail(user, reset);
        }
        return new SuccessResponse(user != null);
    }

    @PostMapping("/finish")
    public SuccessResponse finishProcess(@RequestBody ResetRequest request){
        Boolean successful = false;
        ApplicationUser user = userRepository.findByUsername(request.getUsername());
        if (user != null){
            if (resetService.applyReset(user, request.getCode())){
                user.setPassword(authService.hash(request.getPassword()));
                userRepository.save(user);
                successful = true;
            }
        }
        return new SuccessResponse(successful);
    }
}
