package com.invest.gold.vault.email;

import com.invest.gold.vault.entity.UserEntity;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;


    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public ResponseEntity<String> sentEmail(UserEntity user) {

        try {
            SimpleMailMessage mailTemplate = new SimpleMailMessage();
            EmailDto email = new EmailDto();
            email.setToAddress(user.getEmailId());
            email.setSubject("Welcome to GoldVault - Registration Successful!");
            email.setMessage(getEmailBody(user.getUsername()));

            mailTemplate.setTo(email.getToAddress());
            mailTemplate.setSubject(email.getSubject());
            mailTemplate.setText(email.getMessage());

            javaMailSender.send(mailTemplate);

            return new ResponseEntity<>("Email sent Successfully...", HttpStatus.OK);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    private String getEmailBody(String userName) throws IOException {

        ClassPathResource resource = new ClassPathResource("templates/register-success.txt");

        String template = StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);

        return template.replace("{{name}}", userName);
    }
}
