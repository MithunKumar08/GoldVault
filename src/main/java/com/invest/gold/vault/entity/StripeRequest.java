package com.invest.gold.vault.entity;

import lombok.Data;

@Data
public class StripeRequest {

    private String productName;
    private Long quantity;
    private Long amount;
    private String currency;

}
