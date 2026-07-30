package com.invest.gold.vault.utils;

import com.invest.gold.vault.entity.UserEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
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
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSECRET_KEY())
                .build()
                .parseClaimsJws(token)
                .getBody();

       return claims.getSubject();

    }
}
