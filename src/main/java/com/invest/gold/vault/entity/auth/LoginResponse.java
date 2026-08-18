package com.invest.gold.vault.entity.auth;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    private String token;
    private String role;
    private Long userId;
    private Integer statusCode;
}
