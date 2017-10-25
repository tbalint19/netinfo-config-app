package com.base.coreapi.model.roaming;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class Version {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long systemId;

    private String number;

    private String name;

    private String serializedObjects;

    private Integer orderInBundle;

    @OneToMany(mappedBy = "versionSystemId", cascade = CascadeType.ALL)
    private List<VodaObject> objects;
}
