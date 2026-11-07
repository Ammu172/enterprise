package com.finbank.transaction;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import java.math.BigDecimal;
import java.util.List;
import java.util.Locale;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final RestClient restClient;

    public TransactionService(
            TransactionRepository transactionRepository,
            @Value("${account.service.url}") String accountServiceUrl) {

        this.transactionRepository = transactionRepository;

        this.restClient = RestClient.builder()
                .baseUrl(accountServiceUrl)
                .build();
    }

    public List<Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Transaction not found"));
    }

    public List<Transaction> getTransactionsByAccountId(Long accountId) {
        return transactionRepository.findBySourceAccountId(accountId);
    }

    public Transaction createTransaction(Transaction transaction) {

        if (transaction.getSourceAccountId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Source account ID is required");
        }

        BigDecimal amount = transaction.getAmount();

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Amount must be greater than zero");
        }

        String type = transaction.getTransactionType()
                .trim().toUpperCase(Locale.ROOT);

        transaction.setTransactionType(type);

        Long sourceId = transaction.getSourceAccountId();
        Long destinationId = transaction.getDestinationAccountId();

        validateAccount(sourceId);

        switch (type) {

            case "DEPOSIT":
                adjustBalance(sourceId, amount);

                try {
                    transaction.setStatus("RECORDED");
                    return transactionRepository.save(transaction);
                } catch (RuntimeException ex) {
                    compensate(sourceId, amount.negate(), ex);
                    throw ex;
                }

            case "WITHDRAWAL":
                adjustBalance(sourceId, amount.negate());

                try {
                    transaction.setStatus("RECORDED");
                    return transactionRepository.save(transaction);
                } catch (RuntimeException ex) {
                    compensate(sourceId, amount, ex);
                    throw ex;
                }

            case "TRANSFER":

                if (destinationId == null || destinationId.equals(sourceId)) {
                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "A different destination account is required");
                }

                validateAccount(destinationId);

                // Debit source account first
                adjustBalance(sourceId, amount.negate());

                // Credit destination account
                try {
                    adjustBalance(destinationId, amount);
                } catch (RuntimeException ex) {
                    compensate(sourceId, amount, ex);
                    throw ex;
                }

                // Save transaction record
                try {
                    transaction.setStatus("RECORDED");
                    return transactionRepository.save(transaction);
                } catch (RuntimeException ex) {
                    compensate(destinationId, amount.negate(), ex);
                    compensate(sourceId, amount, ex);
                    throw ex;
                }

            default:
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Unsupported transaction type: " + type);
        }
    }

    private void validateAccount(Long accountId) {
        try {
            restClient.get()
                    .uri("/api/accounts/{id}", accountId)
                    .retrieve()
                    .toBodilessEntity();

        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Account not found");
        }
    }

    private void adjustBalance(Long accountId, BigDecimal adjustment) {
        try {
            restClient.patch()
                    .uri("/api/accounts/{id}/balance", accountId)
                    .body(adjustment)
                    .retrieve()
                    .toBodilessEntity();

        } catch (HttpClientErrorException ex) {
            throw new ResponseStatusException(
                    HttpStatus.valueOf(ex.getStatusCode().value()),
                    "Account balance update failed: " + ex.getResponseBodyAsString());
        }
    }

    private void compensate(
            Long accountId, BigDecimal adjustment, RuntimeException originalError) {

        try {
            adjustBalance(accountId, adjustment);
        } catch (RuntimeException compensationError) {
            originalError.addSuppressed(compensationError);
        }
    }
}
