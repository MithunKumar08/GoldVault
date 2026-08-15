package com.invest.gold.vault.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class TransactionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sessionId;

    private String paymentIntent;

    private Long userId;

    private BigDecimal amount;

    private String currency;

    private String status;

    private LocalDateTime transactionTime;

    private String paymentMethod;

}
