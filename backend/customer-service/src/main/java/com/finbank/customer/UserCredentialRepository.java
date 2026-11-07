package com.finbank.customer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserCredentialRepository
        extends JpaRepository<UserCredential, Long> {

    Optional<UserCredential> findByCustomerId(Long customerId);

    boolean existsByCustomerId(Long customerId);
}
