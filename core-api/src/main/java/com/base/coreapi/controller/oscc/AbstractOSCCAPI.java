package com.base.coreapi.controller.oscc;

import com.base.coreapi.service.oscc.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public abstract class AbstractOSCCAPI {

    @Autowired
    VersionService versionService;

    @Autowired
    TypeService typeService;

    @Autowired
    VersionOfTypeService versionOfTypeService;

    @Autowired
    ObjectService objectService;

    @Autowired
    NamespaceService namespaceService;


}

