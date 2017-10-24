package com.base.coreapi.model.response;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SuccessResponse {

    private Boolean successful;

    public SuccessResponse(Boolean successful) {
        this.successful = successful;
    }

}
