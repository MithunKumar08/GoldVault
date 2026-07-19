package com.invest.gold.vault;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class GoldVaultApplication {

	public static void main(String[] args) {
		SpringApplication.run(GoldVaultApplication.class, args);
	}

}
