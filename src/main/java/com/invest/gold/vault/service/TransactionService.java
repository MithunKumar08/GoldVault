package com.invest.gold.vault.service;

import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.invest.gold.vault.entity.TransactionEntity;
import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.repository.TransactionRepo;
import com.invest.gold.vault.utils.DateUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.UUID;

import static com.invest.gold.vault.constants.GoldConstants.*;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepo transactionRepo;

    public ResponseEntity<String> saveTransaction(UserEntity user,TransactionEntity request){
        try {
            TransactionEntity transaction = new TransactionEntity();
            transaction.setSessionId(String.valueOf(UUID.randomUUID()));
            transaction.setAmount(request.getAmount());
            transaction.setStatus(String.valueOf(SUCCESS));
            transaction.setCurrency(String.valueOf(INR));
            transaction.setTransactionTime(DateUtil.getLocalDate());
            transaction.setPaymentMethod(request.getPaymentMethod());
            transactionRepo.save(transaction);
            return new ResponseEntity<>("Transaction Successfull ...", HttpStatus.OK);

        } catch (Exception e) {
            TransactionEntity transaction = new TransactionEntity();
            transaction.setSessionId(String.valueOf(UUID.randomUUID()));
            transaction.setAmount(request.getAmount());
            transaction.setStatus(String.valueOf(FAILED));
            transaction.setCurrency(String.valueOf(INR));transaction.setTransactionTime(DateUtil.getLocalDate());
            transaction.setPaymentMethod(request.getPaymentMethod());
            transactionRepo.save(transaction);
            return new ResponseEntity<>("Transaction Failed ...", HttpStatus.INTERNAL_SERVER_ERROR);

        }
    }
}
