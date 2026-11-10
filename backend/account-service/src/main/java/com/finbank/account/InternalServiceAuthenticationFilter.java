package com.finbank.account;

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

public class InternalServiceAuthenticationFilter extends OncePerRequestFilter {

    private final String transactionToken;
    private final String customerServiceToken;

    public InternalServiceAuthenticationFilter(
            String transactionToken,
            String customerServiceToken) {
        this.transactionToken = transactionToken;
        this.customerServiceToken = customerServiceToken;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();
        String suppliedToken = request.getHeader("X-Service-Token");

        boolean transactionRequest =
                (HttpMethod.GET.matches(request.getMethod())
                        && path.matches("^/api/accounts/[0-9]+$"))
                ||
                (HttpMethod.PATCH.matches(request.getMethod())
                        && path.matches("^/api/accounts/[0-9]+/balance$"));

        boolean customerServiceRequest =
                HttpMethod.POST.matches(request.getMethod())
                && path.equals("/api/accounts/internal");

        if (suppliedToken != null) {

            if (transactionRequest
                    && matchesToken(suppliedToken, transactionToken)) {

                setServiceAuthentication(
                        "transaction-service", "ROLE_SERVICE_TRANSACTION");

            } else if (customerServiceRequest
                    && matchesToken(suppliedToken, customerServiceToken)) {

                setServiceAuthentication(
                        "customer-service", "ROLE_SERVICE_CUSTOMER");
            }
        }

        filterChain.doFilter(request, response);
    }

    private boolean matchesToken(String supplied, String expected) {
        return expected != null && MessageDigest.isEqual(
                supplied.getBytes(StandardCharsets.UTF_8),
                expected.getBytes(StandardCharsets.UTF_8));
    }

    private void setServiceAuthentication(String name, String role) {
        var authentication =
                new UsernamePasswordAuthenticationToken(
                        name,
                        null,
                        List.of(new SimpleGrantedAuthority(role)));

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}
