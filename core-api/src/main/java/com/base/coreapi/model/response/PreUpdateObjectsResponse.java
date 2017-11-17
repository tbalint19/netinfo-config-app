package com.base.coreapi.model.response;

import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.dto.VersionOfTypeWithIds;
import lombok.Data;

import java.util.List;

@Data
public class PreUpdateObjectsResponse {

    private List<OsccObject> objects;

    private List<VersionOfTypeWithIds> versionOfTypeWithIds;
}
