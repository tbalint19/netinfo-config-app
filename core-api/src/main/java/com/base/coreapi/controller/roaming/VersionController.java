package com.base.coreapi.controller.roaming;

import com.base.coreapi.model.response.SuccessResponse;
import com.base.coreapi.model.roaming.Version;
import com.base.coreapi.model.roaming.VodaObject;
import com.base.coreapi.model.roaming.dto.StructureUpdateDTO;
import com.base.coreapi.repository.VersionRepository;
import com.base.coreapi.repository.VodaObjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roaming/version")
public class VersionController {

    @Autowired
    private VersionRepository versionRepository;

    @Autowired
    private VodaObjectRepository vodaObjectRepository;

    @GetMapping("/all")
    public List<Version> getAll(){
        return versionRepository.findAll();
    }

    @PostMapping("/update/base")
    public SuccessResponse updateBase(@RequestBody Version version){
        versionRepository.save(version);
        return new SuccessResponse(true);
    }

    @PostMapping("/update/structure")
    public SuccessResponse updateStructure(@RequestBody StructureUpdateDTO dto){
        versionRepository.save(dto.getVersion());
        for (Version v: versionRepository
                .findByOrderInBundleGreaterThanEqual(dto.getVersion().getOrderInBundle())){
            v.setSerializedObjects(dto.getVersion().getSerializedObjects());
            versionRepository.save(v);
        }
        vodaObjectRepository.save(dto.getVodaObjects());
        return new SuccessResponse(true);
    }

    @PostMapping("/add")
    @Transactional
    public SuccessResponse add(@RequestBody Version version){
        versionRepository.save(version);
        for (Version v: versionRepository
                .findByOrderInBundleGreaterThanEqual(version.getOrderInBundle())){
            v.setOrderInBundle(v.getOrderInBundle() + 1);
            versionRepository.save(v);
        }
        Version previousVersion = versionRepository
                .findByOrderInBundle(version.getOrderInBundle() - 1);
        if (previousVersion == null){
            return new SuccessResponse(true);
        }
        List<VodaObject> previousObjects = previousVersion.getObjects();
        for (VodaObject obj: previousObjects){
            VodaObject newObj = new VodaObject();
            newObj.setId(obj.getId());
            newObj.setObjectType(obj.getObjectType());
            newObj.setSerializedData(obj.getSerializedData());
            newObj.setVersionSystemId(version.getSystemId());
            vodaObjectRepository.save(newObj);
        }
        return new SuccessResponse(true);
    }

    @PostMapping("/delete")
    @Transactional
    public SuccessResponse delete(@RequestBody Version version){
        versionRepository.delete(version.getSystemId());
        for (Version v: versionRepository
                .findByOrderInBundleGreaterThanEqual(version.getOrderInBundle())) {
            v.setOrderInBundle(v.getOrderInBundle() - 1);
            versionRepository.save(v);
        }
        return new SuccessResponse(true);
    }
}
