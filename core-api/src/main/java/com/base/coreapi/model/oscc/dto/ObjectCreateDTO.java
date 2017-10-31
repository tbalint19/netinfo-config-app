package com.base.coreapi.model.oscc.dto;

import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class ObjectCreateDTO {

    private String id;

    private String serializedData;

    private Long versionOfTypeSystemId;
}
