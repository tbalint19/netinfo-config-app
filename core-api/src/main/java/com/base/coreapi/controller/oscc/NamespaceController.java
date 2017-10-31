package com.base.coreapi.controller.oscc;

import com.base.coreapi.model.oscc.OsccNamespace;
import com.base.coreapi.model.response.SuccessResponse;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/oscc/namespace")
public class NamespaceController extends AbstractOSCCAPI {

    @GetMapping("/all")
    public List<OsccNamespace> getAll(){
        return namespaceService.findAll();
    }

    @PostMapping("/create")
    public SuccessResponse create(@RequestBody OsccNamespace namespace) {
        namespaceService.save(namespace);
        return new SuccessResponse(true);
    }

    @PostMapping("/update")
    public SuccessResponse update(@RequestBody OsccNamespace namespace) {
        namespaceService.save(namespace);
        return new SuccessResponse(true);
    }

    @Transactional
    @PostMapping("/delete")
    public SuccessResponse delete(@RequestBody OsccNamespace namespace) {
        namespaceService.delete(namespace);
        return new SuccessResponse(true);
    }
}
