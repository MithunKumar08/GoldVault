package com.invest.gold.vault.email;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor(force = true)
@AllArgsConstructor
public class EmailDto {

    private String toAddress;
    private String subject;
    private String message;

}
