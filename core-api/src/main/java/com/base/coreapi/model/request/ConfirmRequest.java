package com.base.coreapi.model.request;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConfirmRequest {

    private String credential;

    private String code;

}
