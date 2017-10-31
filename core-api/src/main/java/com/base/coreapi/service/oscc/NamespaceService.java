package com.base.coreapi.service.oscc;

import com.base.coreapi.model.oscc.OsccNamespace;
import com.base.coreapi.repository.oscc.NamespaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NamespaceService {

    @Autowired
    private NamespaceRepository repository;

    public List<OsccNamespace> findAll() {
        return repository.findAll();
    }

    public void save(OsccNamespace namespace) {
        repository.save(namespace);
    }

    public void delete(OsccNamespace namespace) {
        repository.delete(namespace);
    }

    public OsccNamespace findById(Long namespaceSystemId) {
        return repository.findBySystemId(namespaceSystemId);
    }
}
