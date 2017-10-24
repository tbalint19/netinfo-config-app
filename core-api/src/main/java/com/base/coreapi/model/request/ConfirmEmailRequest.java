package com.base.coreapi.model.request;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ConfirmEmailRequest {

    private String to;

    private String name;

    private String confirmationCode;

    private String link;

}
