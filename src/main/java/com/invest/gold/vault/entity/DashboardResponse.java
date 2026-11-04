package com.invest.gold.vault.entity;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class DashboardResponse {

    private Long userId;
    private String userName;
    private BigDecimal wallet_amount;
}
