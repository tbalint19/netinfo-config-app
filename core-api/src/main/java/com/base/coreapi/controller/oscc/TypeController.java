package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.dto.TypeCreateDTO;
import com.base.coreapi.model.response.SuccessResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oscc/type")
public class TypeController extends AbstractOSCCAPI {

    @GetMapping("/all")
    public List<OsccType> getAll(@RequestParam Long namespaceSystemId){
        return typeService.findAll(namespaceSystemId);
    }

    @Transactional
    @PostMapping("/create")
    public SuccessResponse create(@RequestBody TypeCreateDTO dto) {
        typeService.saveFromDTO(dto);
        versionOfTypeService.createStructure(dto.getStructure(), dto.getType());
        return new SuccessResponse(true);
    }

    @PostMapping("/update")
    public SuccessResponse update(@RequestBody OsccType type) {
        typeService.save(type);
        return new SuccessResponse(true);
    }

    @Transactional
    @PostMapping("/delete")
    public SuccessResponse delete(@RequestBody OsccType type) {
        typeService.delete(type);
        return new SuccessResponse(true);
    }
}
