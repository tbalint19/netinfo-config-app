package com.base.coreapi.repository.oscc;

import com.base.coreapi.model.oscc.Version;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VersionRepository extends JpaRepository<Version, Long> {

    Version findByOrderInBundle(Integer orderInBundle);

    List<Version> findByOrderInBundleGreaterThan(Integer orderInBundle);
}
