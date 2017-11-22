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
public class OsccNamespace {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long systemId;

    @Column(unique = true)
    private String name;

    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    @OneToMany(mappedBy = "namespace")
    private List<OsccType> types;
}
