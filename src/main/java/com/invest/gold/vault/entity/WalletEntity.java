package com.invest.gold.vault.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet")
@Data
public class WalletEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long walletId;

    private Long userId;

    private BigDecimal amount_saved;

    private LocalDateTime createdDate;

    private LocalDateTime lastUpdatedDate;
}
