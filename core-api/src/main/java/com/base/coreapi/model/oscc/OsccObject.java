package com.base.coreapi.model.oscc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;

@Data
@Entity
@NoArgsConstructor
@EqualsAndHashCode(exclude = "versionOfType")
@ToString(exclude = "versionOfType")
public class OsccObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long systemId;

    private String id;

    @Column(columnDefinition = "TEXT")
    private String serializedData;

    @ManyToOne
    private VersionOfType versionOfType;
}
