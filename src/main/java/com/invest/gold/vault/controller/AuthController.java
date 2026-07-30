package com.invest.gold.vault.controller;

import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.entity.auth.LoginRequest;
import com.invest.gold.vault.entity.auth.LoginResponse;
import com.invest.gold.vault.service.AuthService;
import com.invest.gold.vault.utils.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth/v1/")
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody UserEntity userRequest){
        try {
            return authService.register(userRequest);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
        try {
            return authService.login(request);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
