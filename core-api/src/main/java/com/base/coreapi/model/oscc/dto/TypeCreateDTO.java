package com.base.coreapi.model.oscc.dto;

import com.base.coreapi.model.oscc.OsccType;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TypeCreateDTO {

    private Long namespaceId;

    private OsccType type;

    private String structure;
}
