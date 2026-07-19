package com.invest.gold.vault.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "users")
@Data
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String userName;
    private String emailId;
    private String password;
    private String mobileNo;
    private String role;
    private LocalDateTime createdDate;
    private LocalDateTime lastUpdatedDate;
}
