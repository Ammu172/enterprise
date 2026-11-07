
package com.finbank.account;
import java.math.BigDecimal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final RestClient restClient;
    public AccountService(
        AccountRepository accountRepository,
        @Value("${customer.service.url}") String customerServiceUrl) {

    this.accountRepository = accountRepository;
    this.restClient = RestClient.builder()
            .baseUrl(customerServiceUrl)
            .build();
}
   public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Account not found"));
    }

    public List<Account> getAccountsByCustomerId(Long customerId) {
        return accountRepository.findByCustomerId(customerId);
    }

    public Account createAccount(Account account) {

        // Check whether customer exists in Customer Service
        try {
            restClient.get()
                    .uri("/api/customers/{id}", account.getCustomerId())
                    .retrieve()
                    .toBodilessEntity();

        } catch (HttpClientErrorException.NotFound ex) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Customer not found");
        }

        // Check duplicate account number
        if (accountRepository.existsByAccountNumber(
                account.getAccountNumber())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Account number already exists");
        }

        return accountRepository.save(account);
    }

    public Account updateAccount(Long id, Account updatedAccount) {

        Account existingAccount = accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Account not found"));

        existingAccount.setAccountType(updatedAccount.getAccountType());
        existingAccount.setBalance(updatedAccount.getBalance());
        existingAccount.setStatus(updatedAccount.getStatus());

        return accountRepository.save(existingAccount);
    }

    public void deleteAccount(Long id) {
        if (!accountRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Account not found");
        }

        accountRepository.deleteById(id);
    }

@Transactional
public Account adjustBalance(Long id, BigDecimal adjustment) {

    if (adjustment == null || adjustment.compareTo(BigDecimal.ZERO) == 0) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Adjustment must not be zero");
    }

    Account account = accountRepository.findByIdForUpdate(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Account not found"));

    BigDecimal newBalance = account.getBalance().add(adjustment);

    if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Insufficient account balance");
    }

    account.setBalance(newBalance);

    return accountRepository.save(account);
}
}
