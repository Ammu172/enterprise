package com.finbank.customer;

public class AuthResponse {

    private Long customerId;
    private String email;
    private String fullName;
    private String token;
    private String role;

    public AuthResponse(Long customerId, String email,
                        String fullName, String token, String role) {
        this.customerId = customerId;
        this.email = email;
        this.fullName = fullName;
        this.token = token;
        this.role = role;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public String getEmail() {
        return email;
    }

    public String getFullName() {
        return fullName;
    }

    public String getToken() {
        return token;
    }

    public String getRole() {
        return role;
    }
}
