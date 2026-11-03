package com.finbank.transaction;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Get all transactions
    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    // Get transaction by ID
    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id);
    }

    // Get transactions by account ID
    @GetMapping("/account/{accountId}")
    public List<Transaction> getTransactionsByAccountId(
            @PathVariable Long accountId) {
        return transactionService.getTransactionsByAccountId(accountId);
    }

    // Create transaction
    @PostMapping
    public ResponseEntity<Transaction> createTransaction(
            @Valid @RequestBody Transaction transaction) {

        Transaction created = transactionService.createTransaction(transaction);

        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }
}
