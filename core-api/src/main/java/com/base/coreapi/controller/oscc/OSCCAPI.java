package com.base.coreapi.controller.oscc;

import com.base.coreapi.service.oscc.VersionService;
import com.base.coreapi.service.oscc.VodaObjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public abstract class OSCCAPI {

    @Autowired
    VersionService versionService;

    @Autowired
    VodaObjectService vodaObjectService;
}
