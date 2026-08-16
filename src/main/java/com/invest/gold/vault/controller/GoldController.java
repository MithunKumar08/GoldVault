package com.invest.gold.vault.controller;

import com.invest.gold.vault.entity.StripeRequest;
import com.invest.gold.vault.entity.StripeResponse;
import com.invest.gold.vault.entity.TransactionEntity;
import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.service.StripService;
import com.invest.gold.vault.service.TransactionService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/gold/v1/")
@RequiredArgsConstructor
public class GoldController {

    Logger logger = LoggerFactory.getLogger(GoldController.class);

    @Value("${stripe.webhook-key}")
    private String WH_KEY;
    private static final String SUCCESS_PAYMENT = "checkout.session.completed";
    private static final String FAILED_PAYMENT = "payment_intent.payment_failed";
    private final StripService stripService;
    private final TransactionService transactionService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping("makepayment")
    public StripeResponse makePayment(@RequestBody StripeRequest request , @AuthenticationPrincipal UserEntity user){
       return stripService.makeStripCall(request, user);
    }

    @PostMapping("webhook")
    public void requestStripe(@RequestBody String payload, @RequestHeader("Stripe-Signature") String header){
        Event event;
        try{
            event = Webhook.constructEvent(payload,header,WH_KEY);
            System.out.println("Event Type: " + event.getType());

            if(SUCCESS_PAYMENT.equals(event.getType()) ) {
                transactionService.processDataSuccess(event);
            }else if( FAILED_PAYMENT.equals(event.getType())){
                transactionService.processDataFailed(event);
            }else logger.info("Ignoring.. Event: {}", event.getType());


        } catch (SignatureVerificationException e) {
            throw new RuntimeException(e);
        } catch (StripeException e) {
            throw new RuntimeException(e);
        }
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("getAllTransactions")
    public List<TransactionEntity> getAllTransactions(@AuthenticationPrincipal UserEntity user){
        try {
            return transactionService.getAllTransactions(user.getUserId());
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
