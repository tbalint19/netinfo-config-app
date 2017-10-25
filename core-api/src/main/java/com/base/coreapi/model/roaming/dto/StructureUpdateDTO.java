package com.base.coreapi.model.roaming.dto;

import com.base.coreapi.model.roaming.Version;
import com.base.coreapi.model.roaming.VodaObject;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class StructureUpdateDTO {

    private Version version;

    private List<VodaObject> vodaObjects;
}
