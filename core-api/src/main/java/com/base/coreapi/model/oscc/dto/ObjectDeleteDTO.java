package com.base.coreapi.model.oscc.dto;

import com.base.coreapi.model.oscc.OsccObject;
import lombok.Data;

import java.util.List;

@Data
public class ObjectDeleteDTO {

    private List<OsccObject> toDelete;

    private List<OsccObject> toUpdate;
}
