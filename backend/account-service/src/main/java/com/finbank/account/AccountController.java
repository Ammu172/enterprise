package com.finbank.account;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    // Admin: view all accounts
    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    // Customer: view only their own accounts
    @GetMapping("/me")
    public List<Account> getMyAccounts(
            @AuthenticationPrincipal Jwt jwt) {

        Long customerId = Long.valueOf(jwt.getSubject());

        return accountService.getAccountsByCustomerId(customerId);
    }

    // Admin or Transaction Service: retrieve an account
    @GetMapping("/{id}")
    public Account getAccountById(@PathVariable Long id) {
        return accountService.getAccountById(id);
    }

    // Admin: retrieve accounts for a specified customer
    @GetMapping("/customer/{customerId}")
    public List<Account> getAccountsByCustomerId(
            @PathVariable Long customerId) {

        return accountService.getAccountsByCustomerId(customerId);
    }

    // Admin: create an account
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Account createAccount(@Valid @RequestBody Account account) {
        return accountService.createAccount(account);
    }

    // Admin: update an account
    @PutMapping("/{id}")
    public Account updateAccount(
            @PathVariable Long id,
            @Valid @RequestBody Account account) {

        return accountService.updateAccount(id, account);
    }

    // Admin: delete an account
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
    }

    // Transaction Service: adjust account balance
    @PatchMapping("/{id}/balance")
    public Account adjustBalance(
            @PathVariable Long id,
            @RequestBody BigDecimal adjustment) {

        return accountService.adjustBalance(id, adjustment);
    }
}


