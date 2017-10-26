package com.base.coreapi.model.oscc.dto;

import com.base.coreapi.model.oscc.Version;
import com.base.coreapi.model.oscc.VodaObject;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class StructureUpdateDTO {

    private Version version;

    private List<VodaObject> vodaObjects;
}
