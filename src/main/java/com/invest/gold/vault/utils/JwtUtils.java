package com.invest.gold.vault.utils;

import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.exception.GoldBadRequestException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtils {

    private final String SECRET_KEY = "mithunkumarmysore2003@gmail.com6363mithun644548";

    private SecretKey getSECRET_KEY(){
         return Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
    }

    public String getToken(UserEntity request) {
        return Jwts.builder()
                .setSubject(request.getUsername())
                .claim("userId",request.getUserId())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000*60*10))
                .signWith(getSECRET_KEY())
                .compact();

    }

    public String getUserNameFromToken(String token) {
        try{
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(getSECRET_KEY())
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            return claims.getSubject();
        } catch (Exception e) {
            throw new GoldBadRequestException("Incorrect Token or Expired Token.... Please Login Again....");
        }


    }
}
