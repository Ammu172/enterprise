package com.finbank.transaction;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/{id}")
    public Transaction getTransactionById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        Long customerId = Long.valueOf(jwt.getSubject());

        return transactionService.getTransactionById(id, customerId);
    }

    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactionsByAccountId(
            @PathVariable Long accountId,
            @AuthenticationPrincipal Jwt jwt) {

        Long customerId = Long.valueOf(jwt.getSubject());

        return transactionService.getTransactionsByAccountId(
                accountId, customerId);
    }

    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @Valid @RequestBody Transaction transaction,
            @AuthenticationPrincipal Jwt jwt) {

        Long customerId = Long.valueOf(jwt.getSubject());

        Transaction created = transactionService.createTransaction(
                transaction, customerId);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
