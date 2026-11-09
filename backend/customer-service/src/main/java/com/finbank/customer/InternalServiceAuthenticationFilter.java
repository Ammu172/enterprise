package com.finbank.customer;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.List;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class InternalServiceAuthenticationFilter
        extends OncePerRequestFilter {

    private final String serviceToken;

    public InternalServiceAuthenticationFilter(String serviceToken) {
        this.serviceToken = serviceToken;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        boolean customerLookup =
                HttpMethod.GET.matches(request.getMethod())
                && request.getRequestURI().matches(
                        "^/api/customers/[0-9]+$");

        if (customerLookup) {
            String suppliedToken =
                    request.getHeader("X-Service-Token");

            if (suppliedToken != null
                    && serviceToken != null
                    && MessageDigest.isEqual(
                            suppliedToken.getBytes(StandardCharsets.UTF_8),
                            serviceToken.getBytes(StandardCharsets.UTF_8))) {

                var authentication =
                        new UsernamePasswordAuthenticationToken(
                                "account-service",
                                null,
                                List.of(new SimpleGrantedAuthority(
                                        "ROLE_SERVICE_ACCOUNT")));

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
