package com.base.coreapi.model.roaming;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Data
@Entity
@NoArgsConstructor
public class VodaObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long systemId;

    private String id;

    private String objectType;

    private String serializedData;

    private Long versionSystemId;

}
