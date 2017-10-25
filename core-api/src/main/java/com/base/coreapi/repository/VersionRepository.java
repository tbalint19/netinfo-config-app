package com.base.coreapi.repository;

import com.base.coreapi.model.roaming.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VersionRepository extends JpaRepository<Version, Long> {

    Version findBySystemId(Long systemId);

    Version findByOrderInBundle(Integer orderInBundle);

    List<Version> findByOrderInBundleGreaterThanEqual(Integer orderInBundle);
}
