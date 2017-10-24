package com.base.coreapi.service;

import com.base.coreapi.model.ApplicationUser;
import com.base.coreapi.model.Confirmation;
import com.base.coreapi.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class UserService {

    @Autowired
    private TokenService tokenService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RandomService randomService;

    private static final String NO_CONF_PREFIX = "noconf ";

    public ApplicationUser getUserByCredential(String credential){
        ApplicationUser userInDb;
        if (credential.contains("@")){
            userInDb = userRepository.findByEmailIgnoreCase(credential);
        } else {
            userInDb = userRepository.findByUsernameIgnoreCase(credential);
        }
        return userInDb;
    }

    public ApplicationUser createUser(ApplicationUser user, Confirmation confirmation){
        String hashedPassword = authService.hash(user.getPassword());
        user.setPassword(hashedPassword);
        user.setConfirmed(false);
        user.setConfirmation(confirmation);
        user.setCreated(new Date());
        userRepository.save(user);
        return user;
    }

    public String loginUser(ApplicationUser user, String rawPassword){
        ApplicationUser authenticatedUser = authService.authenticate(user, rawPassword);
        String token = null;
        if (authenticatedUser != null){
            if (authenticatedUser.getConfirmed()) {
                token = tokenService.createToken(authenticatedUser.getUsername());
            } else {
                token = NO_CONF_PREFIX + randomService.getRandomString(50);
            }
        }
        return token;
    }
}
