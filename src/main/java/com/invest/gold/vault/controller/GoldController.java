package com.invest.gold.vault.controller;

import com.invest.gold.vault.entity.StripeRequest;
import com.invest.gold.vault.entity.StripeResponse;
import com.invest.gold.vault.service.StripService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/gold/v1/")
@RequiredArgsConstructor
public class GoldController {

    @Value("${stripe.webhook-key}")
    private String WH_KEY;
    private final StripService stripService;

    @GetMapping("test")
    public String test(){
        return "Gold Controller .....";
    }

    @PostMapping("makepayment")
    public StripeResponse makePayment(@RequestBody StripeRequest request){
       return stripService.makeStripCall(request);
    }

    @PostMapping("webhook")
    public void requestStripe(@RequestBody String payload, @RequestHeader("Stripe-Signature") String header){
        Event event;
        try{
            event = Webhook.constructEvent(payload,header,WH_KEY);
            System.out.println("Event Type: " + event.getType());
        } catch (SignatureVerificationException e) {
            throw new RuntimeException(e);
        }
    }

//    @PostMapping("transaction/success")
//    public String successPayment(@RequestBody )
}
