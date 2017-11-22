package com.base.coreapi.model.oscc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
public class VersionOfType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long systemId;

    @Column(columnDefinition = "TEXT")
    private String structure;

    @ManyToOne
    private Version version;

    @ManyToOne
    private OsccType type;

    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    @OneToMany(mappedBy = "versionOfType")
    private List<OsccObject> objects;
}
