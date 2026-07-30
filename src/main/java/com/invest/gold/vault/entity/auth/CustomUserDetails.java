package com.invest.gold.vault.entity.auth;

import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.repository.AuthRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CustomUserDetails implements UserDetailsService {


    private final AuthRepo authRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity user = authRepo.findByUserName(username);
        if(user == null){
            throw new UsernameNotFoundException("User Not Found, Please Register...");
        }
        return user;
    }
}
