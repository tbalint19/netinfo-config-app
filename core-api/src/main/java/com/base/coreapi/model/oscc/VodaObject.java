package com.base.coreapi.model.oscc;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Data
@Entity
@NoArgsConstructor
public class VodaObject {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long systemId;

    private String id;

    @ManyToOne
    private OsccType osccType;

    private String objectType;

    @Column(columnDefinition = "TEXT")
    private String serializedData;

    @ManyToOne
    private Version version;

}
