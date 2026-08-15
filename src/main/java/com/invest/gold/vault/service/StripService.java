package com.invest.gold.vault.service;

import com.invest.gold.vault.entity.StripeRequest;
import com.invest.gold.vault.entity.StripeResponse;
import com.invest.gold.vault.entity.TransactionEntity;
import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.repository.TransactionRepo;
import com.invest.gold.vault.utils.DateUtil;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.UUID;

import static com.invest.gold.vault.constants.GoldConstants.*;

@Service
@RequiredArgsConstructor
public class StripService {

    @Value("${stripe.key}")
    private String API_KEY;

    private static final Logger logger = LoggerFactory.getLogger(StripService.class);

    private final TransactionRepo transactionRepo;

    public StripeResponse makeStripCall(StripeRequest request, UserEntity user){

        Stripe.apiKey = API_KEY;

        SessionCreateParams.LineItem.PriceData.ProductData product = SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName(request.getProductName()).build();

        SessionCreateParams.LineItem.PriceData amount = SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency(request.getCurrency() == null ? "USD" : request.getCurrency())
                .setUnitAmount(request.getAmount())
                .setProductData(product).build();

        SessionCreateParams.LineItem lineItem = SessionCreateParams.LineItem.builder()
                .setQuantity(request.getQuantity())
                .setPriceData(amount).build();

        String sessionId = UUID.randomUUID().toString();

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .putMetadata("sessionId", sessionId)
                .setSuccessUrl("http://localhost:8080/success")
                .setCancelUrl("http://localhost:8080/failed")
                .addLineItem(lineItem)
                .build();

        Session session = null;
        TransactionEntity transaction = new TransactionEntity();

        try{
            session = Session.create(params);
            logger.info("Session Id: {}",session.getMetadata().get("sessionId"));
            transaction.setSessionId(session.getMetadata().get("sessionId"));
            transaction.setPaymentIntent(session.getPaymentIntent());
            transaction.setAmount(BigDecimal.valueOf(session.getAmountTotal()));
            transaction.setStatus(String.valueOf(PENDING));
            transaction.setCurrency(session.getCurrency());
            transaction.setTransactionTime(DateUtil.getLocalDate());
            transaction.setPaymentMethod(String.valueOf(CASHLESS));
            transaction.setUserId(user.getUserId());

            transactionRepo.save(transaction);

        } catch (Exception e) {
            transaction.setSessionId(session.getMetadata().get("sessionId"));
            transaction.setAmount(BigDecimal.valueOf(session.getAmountTotal()));
            transaction.setStatus(String.valueOf(FAILED));
            transaction.setCurrency(session.getCurrency());
            transaction.setTransactionTime(DateUtil.getLocalDate());
            transaction.setPaymentMethod(String.valueOf(CASHLESS));
            transaction.setUserId(user.getUserId());
            transactionRepo.save(transaction);
            throw new RuntimeException(e);
        }

        return StripeResponse.builder()
                .status("SUCCESS")
                .message("PAYMENT SUCCESS")
                .sessionId(session.getMetadata().get("sessionId"))
                .url(session.getUrl())
                .build();

    }
}
