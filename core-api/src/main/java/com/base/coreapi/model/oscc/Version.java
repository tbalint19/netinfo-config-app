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
public class Version {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long systemId;

    private String number;

    private String name;

    private Integer orderInBundle;

    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    @OneToMany(mappedBy = "version")
    private List<VersionOfType> versionOfTypes;
}
