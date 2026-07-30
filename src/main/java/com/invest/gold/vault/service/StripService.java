package com.invest.gold.vault.service;

import com.invest.gold.vault.entity.StripeRequest;
import com.invest.gold.vault.entity.StripeResponse;
import com.invest.gold.vault.entity.TransactionEntity;
import com.invest.gold.vault.utils.DateUtil;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

import static com.invest.gold.vault.constants.GoldConstants.*;

@Service
public class StripService {

    @Value("${stripe.key}")
    private String API_KEY;

    public StripeResponse makeStripCall(StripeRequest request){

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

        SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("http://localhost:8080/success")
                .setCancelUrl("http://localhost:8080/failed")
                .addLineItem(lineItem)
                .build();

        Session session = null;
        TransactionEntity transaction = new TransactionEntity();

        try{
            session = Session.create(params);
            transaction.setSessionId(session.getId());
            transaction.setAmount(BigDecimal.valueOf(session.getAmountTotal()));
            transaction.setStatus(String.valueOf(PENDING));
            transaction.setCurrency(session.getCurrency());
            transaction.setTransactionTime(DateUtil.getLocalDate());
            transaction.setPaymentMethod(String.valueOf(CASHLESS));
        } catch (Exception e) {
            transaction.setSessionId(session.getId());
            transaction.setAmount(BigDecimal.valueOf(session.getAmountTotal()));
            transaction.setStatus(String.valueOf(FAILED));
            transaction.setCurrency(session.getCurrency());
            transaction.setTransactionTime(DateUtil.getLocalDate());
            transaction.setPaymentMethod(String.valueOf(CASHLESS));
            throw new RuntimeException(e);
        }

        return StripeResponse.builder()
                .status("SUCCESS")
                .message("PAYMENT SUCCESS")
                .sessionId(session.getId())
                .url(session.getUrl())
                .build();

    }
}
