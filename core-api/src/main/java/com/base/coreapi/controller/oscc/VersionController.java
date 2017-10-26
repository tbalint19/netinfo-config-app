package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VodaObject;
import com.base.coreapi.model.oscc.dto.StructureUpdateDTO;
import com.base.coreapi.model.oscc.enums.OrderDirections;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roaming/version")
public class VersionController extends OSCCAPI {

    @GetMapping("/all")
    public List<Version> getAll(){
        List<Version> allVersions = versionService.findAll();
        return allVersions;
    }

    @Transactional
    @PostMapping("/create")
    public SuccessResponse add(@RequestBody Version version){
        versionService.createVersionWithInitialObjects(version);
        versionService.reOrderVersions(version, OrderDirections.UP);
        return new SuccessResponse(true);
    }

    @PostMapping("/update/base")
    public SuccessResponse updateBase(@RequestBody Version version){
        versionService.save(version);
        return new SuccessResponse(true);
    }

    @GetMapping("/allupper/{orderInBundle}")
    public  List<VodaObject> getAllAndUpperForVersion(@PathVariable Integer orderInBundle) {
        List<Version> versions = versionService.getAllUpper(orderInBundle);
        return versionService.getAllRelatedObjects(versions);
    }

    @Transactional
    @PostMapping("/update/structure")
    public SuccessResponse updateStructure(@RequestBody StructureUpdateDTO dto){
        versionService.updateStructureForAllUpperVersions(dto.getVersion());
        vodaObjectService.save(dto.getVodaObjects());
        return new SuccessResponse(true);
    }

    @Transactional
    @PostMapping("/delete")
    public SuccessResponse delete(@RequestBody Version version){
        versionService.deleteWithRelatedObjects(version);
        versionService.reOrderVersions(version, OrderDirections.DOWN);
        return new SuccessResponse(true);
    }
}
