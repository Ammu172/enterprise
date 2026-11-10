package com.finbank.account;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class InternalAccountRequest {

    @NotNull(message = "Customer ID is required")
    @Positive(message = "Customer ID must be positive")
    private Long customerId;

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
