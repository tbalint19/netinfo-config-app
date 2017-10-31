package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.VersionOfType;
import com.base.coreapi.model.oscc.enums.OrderDirections;
import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.oscc.Version;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oscc/version")
public class VersionController extends AbstractOSCCAPI {

    @GetMapping("/all")
    public List<Version> getAll(){
        return versionService.findAll();
    }

    @Transactional
    @PostMapping("/create")
    public SuccessResponse create(@RequestBody Version version) {
        Version currentInPlace = versionService.findByOrderInBundle(version.getOrderInBundle());
        versionService.createWithObjectsAndStructures(version);
        versionService.reorder(currentInPlace, OrderDirections.UP);
        return new SuccessResponse(true);
    }

    @PostMapping("/update")
    public SuccessResponse update(@RequestBody Version version) {
        versionService.save(version);
        return new SuccessResponse(true);
    }

    @Transactional
    @PostMapping("/delete")
    public SuccessResponse delete(@RequestBody Version version) {
        versionService.reorder(version, OrderDirections.DOWN);
        versionService.delete(version);
        return new SuccessResponse(true);
    }
}
