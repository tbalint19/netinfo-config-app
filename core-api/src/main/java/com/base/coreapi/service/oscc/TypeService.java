package com.base.coreapi.service.oscc;

import com.base.coreapi.model.oscc.OsccNamespace;
import com.base.coreapi.model.oscc.OsccType;
import com.base.coreapi.model.oscc.dto.TypeCreateDTO;
import com.base.coreapi.repository.oscc.NamespaceRepository;
import com.base.coreapi.repository.oscc.TypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class TypeService {

    @Autowired
    private TypeRepository repository;

    @Autowired
    private NamespaceRepository namespaceRepository;


    public List<OsccType> findAll(Long namespaceSystemId) {
        List<OsccType> all = new ArrayList<>();
        all.addAll(repository.findByNamespace_SystemId(namespaceSystemId));
        all.addAll(repository.findByNamespace_SystemId(null));
        return all;
    }


    public void save(OsccType type) {
        repository.save(type);
    }

    public void delete(OsccType type) {
        repository.delete(type);
    }

    public OsccType findBySystemId(Long typeSystemId) {
        return repository.findBySystemId(typeSystemId);
    }

    public void saveFromDTO(TypeCreateDTO dto) {
        OsccType type = dto.getType();
        type.setNamespace(namespaceRepository.findBySystemId(dto.getNamespaceId()));
        save(type);
    }
}
