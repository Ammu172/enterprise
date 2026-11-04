package com.finbank.transaction;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import java.util.List;

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

        // Validate source account using Account Service
        try {
            restClient.get()
                    .uri("/api/accounts/{id}", transaction.getSourceAccountId())
                    .retrieve()
                    .toBodilessEntity();

        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Source account not found");
        }

        transaction.setStatus("RECORDED");

        return transactionRepository.save(transaction);
    }
}
