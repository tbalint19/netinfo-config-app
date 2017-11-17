package com.base.coreapi.config;

import com.base.coreapi.model.auth.ApplicationUser;
import com.base.coreapi.model.auth.Confirmation;
import com.base.coreapi.model.oscc.OsccNamespace;
import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VersionOfType;
import com.base.coreapi.service.auth.ConfirmationService;
import com.base.coreapi.service.auth.UserService;
import com.base.coreapi.service.oscc.NamespaceService;
import com.base.coreapi.service.oscc.TypeService;
import com.base.coreapi.service.oscc.VersionOfTypeService;
import com.base.coreapi.service.oscc.VersionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

@Service
public class DataLoader {


    @Autowired
    private UserService userService;

    @Autowired
    private ConfirmationService confirmationService;

    @Autowired
    private NamespaceService namespaceService;

    @Autowired
    private VersionService versionService;

    @Autowired
    private TypeService typeService;

    @Autowired
    private VersionOfTypeService versionOfTypeService;

    @PostConstruct
    public void createUser() {
        ApplicationUser user = new ApplicationUser();
        user.setEmail("");
        user.setUsername("tothbalint");
        user.setPassword("0123456789");
        Confirmation confirmation = confirmationService.createConfirmation();
        userService.createUser(user, confirmation);
        confirmationService.attemptConfirm(user.getUsername(), confirmation.getCode());
    }

    @PostConstruct
    public void createOsccData() {
        OsccNamespace namespace = new OsccNamespace();
        namespace.setName("Post");
        namespaceService.save(namespace);

        Version version = new Version();
        version.setOrderInBundle(1);
        version.setName("2018 marc");
        version.setNumber("1.0.0");
        versionService.save(version);

        OsccType type = new OsccType();
        type.setName("multilanguage");
        typeService.save(type);

        VersionOfType multilanguage = new VersionOfType();
        multilanguage.setType(type);
        multilanguage.setVersion(version);
        multilanguage.setStructure("{\"multilanguage\":{\"eng\":\"string\", \"hun\":\"string\", \"unLocalized\":\"string\"}}");
        versionOfTypeService.save(multilanguage);
    }
}
