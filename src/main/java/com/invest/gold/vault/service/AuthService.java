package com.invest.gold.vault.service;

import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.repository.AuthRepo;
import com.invest.gold.vault.utils.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepo authRepo;
    private final BCryptPasswordEncoder encoder;

    public String register(UserEntity userRequest) {
        try{
            UserEntity user = new UserEntity();
            user.setUserName(userRequest.getUserName());
            user.setPassword(encoder.encode(userRequest.getPassword()));
            user.setEmailId(userRequest.getEmailId());
            user.setRole(userRequest.getRole());
            user.setMobileNo(userRequest.getMobileNo());
            user.setCreatedDate(DateUtil.getLocalDate());
            user.setLastUpdatedDate(DateUtil.getLocalDate());
            authRepo.save(user);
            return "User Registered Successfully..";
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}
