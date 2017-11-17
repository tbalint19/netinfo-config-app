package com.base.coreapi.model.oscc.dto;

import com.base.coreapi.model.oscc.VersionOfType;
import lombok.Data;

import java.util.List;

@Data
public class VersionOfTypeWithIds {


    private VersionOfType versionOfType;

    private List<String> ids;
}
