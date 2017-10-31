package com.base.coreapi.model.oscc.dto;

import com.base.coreapi.model.oscc.OsccObject;
import com.base.coreapi.model.oscc.VersionOfType;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class VersionOfTypeUpdateDTO {

    private List<OsccObject> objects;

    private List<VersionOfType> versionOfTypes;
}

