package com.invest.gold.vault.entity.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "User Name is Required")
    @Pattern(
            regexp = "^(?=.*\\d)[a-zA-Z][a-zA-Z0-9]{4,}$",
            message = "Username must start with a letter, contain at least 5 characters, and include at least one number"
    )
    private String userName;

    @NotBlank(message = "Password is required")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    )
    private String password;
}
