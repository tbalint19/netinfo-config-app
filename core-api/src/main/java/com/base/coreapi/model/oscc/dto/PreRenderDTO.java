package com.base.coreapi.model.oscc.dto;

import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.VersionOfType;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class PreRenderDTO {

    private List<OsccObject> objects;

    private List<VersionOfType> versionOfTypes;
}
