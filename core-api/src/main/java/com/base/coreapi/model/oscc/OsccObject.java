package com.base.coreapi.model.oscc;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Data
@Entity
@NoArgsConstructor
@ToString(exclude = "versionOfType")
@EqualsAndHashCode(exclude = "versionOfType")
public class OsccObject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long systemId;

    private String id;

    @Column(columnDefinition = "TEXT")
    private String serializedData;

    @ManyToOne
    private VersionOfType versionOfType;
}
