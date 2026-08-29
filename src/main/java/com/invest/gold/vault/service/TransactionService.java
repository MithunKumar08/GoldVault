package com.invest.gold.vault.service;

import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.invest.gold.vault.dao.TransactionDao;
import com.invest.gold.vault.entity.PageResponse;
import com.invest.gold.vault.entity.TransactionEntity;
import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.entity.WalletEntity;
import com.invest.gold.vault.repository.TransactionRepo;
import com.invest.gold.vault.utils.DateUtil;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import static com.invest.gold.vault.constants.GoldConstants.*;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepo transactionRepo;
    private final TransactionDao transactionDao;

    @Value("${stripe.key}")
    private String API_KEY;


    public void saveWalletData(WalletEntity wallet, UserEntity user){
        try{
            wallet.setUserId(user.getUserId());
            wallet.setAmount_saved(new BigDecimal(0));
            wallet.setCreatedDate(DateUtil.getLocalDate());
            wallet.setLastUpdatedDate(DateUtil.getLocalDate());
            transactionDao.saveWalletData(wallet);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void processDataSuccess(Event event) {

        logger.info("Event type: {}",event.getType());

        logger.info("Raw JSON Object: {}",event.getDataObjectDeserializer().getRawJson().toString());

        logger.info("Object is present: {}",event.getDataObjectDeserializer().getObject().isPresent());


        Session session = (Session) event.getDataObjectDeserializer()
                .getObject()
                .orElse(null);

        if(session != null){
            String sessionId = session.getMetadata().get("sessionId");
            String paymentStatus = session.getPaymentStatus();

            logger.info("sessionId: {}  paymentStatus: {}",sessionId,paymentStatus);

            TransactionEntity tran = transactionRepo.findBySessionId(sessionId).get();

            if(sessionId.equals(tran.getSessionId())){
                tran.setStatus(String.valueOf(SUCCESS));
                transactionRepo.save(tran);
                WalletEntity data = transactionDao.getData(tran.getUserId());
                BigDecimal total_amount = tran.getAmount().add(data.getAmount_saved());
                transactionDao.updateWallet(total_amount,DateUtil.getLocalDate(),tran.getUserId());
            }

        }
    }

    public void processDataFailed(Event event) throws StripeException {

        Stripe.apiKey = API_KEY;

        logger.info("Event type: {}",event.getType());

        logger.info("Raw JSON Object: {}",event.getDataObjectDeserializer().getRawJson().toString());

        logger.info("Object is present: {}",event.getDataObjectDeserializer().getObject().isPresent());

        //String rawJson = event.getDataObjectDeserializer().getRawJson();

        PaymentIntent paymentIntent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject()
                .orElse(null);

        if(paymentIntent != null){
            String sessionId = paymentIntent.getMetadata().get("sessionId");

            logger.info("Failed Record sessionId: {} ",sessionId);

            TransactionEntity tran = transactionRepo.findBySessionId(sessionId).get();

            tran.setStatus(String.valueOf(FAILED));
            transactionRepo.save(tran);
        }
    }

    public ResponseEntity<PageResponse> getAllTransactions(int pageNo, int size, Long userId) {
        try{
            Pageable pages = PageRequest.of(pageNo,size);
            Page<TransactionEntity> response = transactionRepo.findByUserId(userId, pages);
            PageResponse pageResponse = new PageResponse();

            pageResponse.setContent(response.getContent());
            pageResponse.setPage(String.valueOf(pageNo));
            pageResponse.setSize(String.valueOf(response.getSize()));
            pageResponse.setTotalElements(String.valueOf(response.getTotalElements()));
            pageResponse.setTotalPages(String.valueOf(response.getTotalPages()));
            pageResponse.setPage(String.valueOf(response.getTotalPages()));
            pageResponse.setLast(response.isLast());
            return new ResponseEntity<>(pageResponse, HttpStatus.OK);

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
