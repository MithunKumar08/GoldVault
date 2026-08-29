package com.invest.gold.vault.service;

import com.invest.gold.vault.dao.TransactionDao;
import com.invest.gold.vault.entity.TransactionEntity;
import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.entity.WalletEntity;
import com.invest.gold.vault.entity.auth.LoginRequest;
import com.invest.gold.vault.entity.auth.LoginResponse;
import com.invest.gold.vault.model.UserDto;
import com.invest.gold.vault.repository.AuthRepo;
import com.invest.gold.vault.repository.TransactionRepo;
import com.invest.gold.vault.utils.DateUtil;
import com.invest.gold.vault.utils.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.catalina.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static com.invest.gold.vault.constants.GoldConstants.CUSTOMER;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthRepo authRepo;
    private final BCryptPasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final TransactionService transactionService;
    private final TransactionRepo transactionRepo;

    public ResponseEntity<String> register(UserEntity userRequest) {
        try{
            UserEntity userEntity = authRepo.findByEmailId(userRequest.getEmailId());
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
                new UsernamePasswordAuthenticationToken(request.getUserEmail(),request.getPassword())
        );

        UserEntity user = (UserEntity) authentication.getPrincipal();
        assert user != null;
        String token = jwtUtils.getToken(user);
        return new ResponseEntity<>(new LoginResponse(token,user.getRole(),user.getUserId(),HttpStatus.OK.value()),HttpStatus.OK);
    }

    public ResponseEntity<String> updateUser(UserEntity user, UserDto request) {
        try{

            UserEntity updateData = new UserEntity();
            UserEntity userDao = authRepo.findById(user.getUserId()).orElse(null);
            if(userDao != null){
                updateData.setUserId(user.getUserId());
                updateData.setUserName(request.getUsername());
                updateData.setPassword(request.getPassword());
                updateData.setRole(userDao.getRole());
                updateData.setEmailId(userDao.getEmailId());
                updateData.setMobileNo(request.getMobileNo());
                updateData.setLastUpdatedDate(DateUtil.getLocalDate());

                authRepo.save(updateData);
                return new ResponseEntity<>("User Data Updated Successfully...",HttpStatus.OK);
            }else return new ResponseEntity<>("Something went wrong, Please Try Again...",HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<String> deleteUser(Long userId) {
        try{
            Optional<UserEntity> user = authRepo.findById(userId);
            if(user.isPresent()){
                authRepo.delete(user.get());
                return new ResponseEntity<>("User Data Deleted Successfully with UserId: " + userId,HttpStatus.OK);
            }else return new ResponseEntity<>("User Data doesn't exists...  UserId: " + userId,HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<String> deleteTransaction(Long tranId) {
        try{
            Optional<TransactionEntity> transaction = transactionRepo.findById(tranId);
            if(transaction.isPresent()){
                transactionRepo.delete(transaction.get());
                return new ResponseEntity<>("Transaction Data Deleted Successfully with TransactionId: " + tranId,HttpStatus.OK);
            }else return new ResponseEntity<>("Transaction Data doesn't exists...  TransactionId: " + tranId,HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
