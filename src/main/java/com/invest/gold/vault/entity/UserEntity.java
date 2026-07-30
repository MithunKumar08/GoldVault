package com.invest.gold.vault.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
@Data
public class UserEntity implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    @NotBlank(message = "User Name is Required")
    @Pattern(
            regexp = "^(?=.*\\d)[a-zA-Z][a-zA-Z0-9]{4,}$",
            message = "Username must start with a letter, contain at least 5 characters, and include at least one number"
    )
    private String userName;

    @NotBlank(message = "Email is Required")
    @Email(message = "Email is invalid")
    private String emailId;

    @NotBlank(message = "Password is required")
    @Pattern(
    regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$",
    message = "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
            )
    private String password;

    @NotBlank(message = "Mobile number is required")
    @Pattern(
    regexp = "^[6-9]\\d{9}$",
    message = "Mobile number must be 10 digits and start with 6, 7, 8, or 9"
            )
    private String mobileNo;
    private String role;
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdatedDate;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return userName;
    }
}
