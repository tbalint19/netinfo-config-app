package com.base.coreapi.model.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ResetRequest {

    private String code;

    private String username;

    private String password;

}
