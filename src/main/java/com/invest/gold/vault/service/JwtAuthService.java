package com.invest.gold.vault.service;

import com.invest.gold.vault.entity.UserEntity;
import com.invest.gold.vault.exception.GoldBadRequestException;
import com.invest.gold.vault.repository.AuthRepo;
import com.invest.gold.vault.utils.JwtUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class JwtAuthService extends OncePerRequestFilter {

    private final AuthRepo authRepo;
    private final JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {

        String requestURL = String.valueOf(request.getRequestURL());
        if(requestURL.contains("/auth/v1/register") || requestURL.contains("/auth/v1/login") || requestURL.contains("/gold/v1/webhook") || requestURL.contains("/h2-console")){
            filterChain.doFilter(request,response);
            return;
        }
        try {
            String header = request.getHeader("Authorization");

            if (!header.contains("Bearer")) {
                throw new RuntimeException("Missing Header......");
            }

            String token = header.split("Bearer ")[1];

            String getUserName;

            try {
                    getUserName = jwtUtils.getUserEmailFromToken(token);

                } catch (GoldBadRequestException e) {

                    response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    response.setContentType("application/json");

                    response.getWriter().write("""
            {
                "status":"%s",
                "message":"%s"
            }
            """.formatted(response.getStatus(),e.getMessage()));

                    return;
                }

            if (getUserName != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserEntity user = authRepo.findByEmailId(getUserName);
                if(user == null){
                    throw new UsernameNotFoundException("User Not Found, Please Register..");
                }
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                        new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }

            filterChain.doFilter(request, response);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
}