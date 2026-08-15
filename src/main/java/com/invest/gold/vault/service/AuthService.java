package com.invest.gold.vault.service;

import com.invest.gold.vault.dao.TransactionDao;
import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.entity.WalletEntity;
import com.invest.gold.vault.entity.auth.LoginRequest;
import com.invest.gold.vault.entity.auth.LoginResponse;
import com.invest.gold.vault.repository.AuthRepo;
import com.invest.gold.vault.utils.DateUtil;
import com.invest.gold.vault.utils.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import static com.invest.gold.vault.constants.GoldConstants.CUSTOMER;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepo authRepo;
    private final BCryptPasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final TransactionService transactionService;

    public ResponseEntity<String> register(UserEntity userRequest) {
        try{
            UserEntity userEntity = authRepo.findByUserName(userRequest.getUsername());
            if(userEntity != null){
                return new ResponseEntity<>("User Already Exists..", HttpStatus.BAD_REQUEST);
            }
            UserEntity user = new UserEntity();
            user.setUserName(userRequest.getUsername());
            user.setPassword(encoder.encode(userRequest.getPassword()));
            user.setEmailId(userRequest.getEmailId());
            user.setRole(String.valueOf(CUSTOMER));
            user.setMobileNo(userRequest.getMobileNo());
            user.setCreatedDate(DateUtil.getLocalDate());
            user.setLastUpdatedDate(DateUtil.getLocalDate());
            authRepo.save(user);

            transactionService.saveWalletData(new WalletEntity(),user);
            return new ResponseEntity<>("User Registered Successfully..",HttpStatus.CREATED);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }


    public ResponseEntity<LoginResponse> login(@Valid LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUserName(),request.getPassword())
        );

        UserEntity user = (UserEntity) authentication.getPrincipal();
        assert user != null;
        String token = jwtUtils.getToken(user);
        return new ResponseEntity<>(new LoginResponse(token,user.getUserId(),HttpStatus.OK.value()),HttpStatus.OK);
    }
}
