package com.base.coreapi.controller;

import com.base.coreapi.model.response.CheckResponse;
import com.base.coreapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/check")
public class CheckController extends API {

    @GetMapping("/username")
    public CheckResponse checkUsername(@RequestParam String username){
        Boolean available = userRepository.findByUsernameIgnoreCase(username) == null;
        return new CheckResponse(available);
    }

    @GetMapping("/email")
    public CheckResponse checkEmail(@RequestParam String email){
        Boolean available = userRepository.findByEmailIgnoreCase(email) == null;
        return new CheckResponse(available);
    }
}
