package com.finbank.customer;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final UserCredentialRepository credentialRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            CustomerRepository customerRepository,
            UserCredentialRepository credentialRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.customerRepository = customerRepository;
        this.credentialRepository = credentialRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        if (customerRepository.existsByEmail(email)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Email is already registered");
        }

        Customer customer = new Customer(
                request.getFirstName().trim(),
                request.getLastName().trim(),
                email,
                request.getPhone().trim()
        );

        Customer savedCustomer = customerRepository.save(customer);

        UserCredential credential = new UserCredential();
        credential.setCustomerId(savedCustomer.getId());
        credential.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));
        credential.setRole("CUSTOMER");

        credentialRepository.save(credential);

        String token = jwtService.generateToken(
                savedCustomer.getId(),
                email,
                credential.getRole()
        );

        return new AuthResponse(
                savedCustomer.getId(),
                email,
                savedCustomer.getFirstName() + " " +
                        savedCustomer.getLastName(),
                token,
                credential.getRole()
        );
    }

    public AuthResponse login(LoginRequest request) {

        String email = request.getEmail().trim().toLowerCase();

        Customer customer = customerRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Invalid email or password"));

        UserCredential credential =
                credentialRepository.findByCustomerId(customer.getId())
                        .orElseThrow(() -> new ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Invalid email or password"));

        if (!passwordEncoder.matches(
                request.getPassword(),
                credential.getPasswordHash())) {

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid email or password");
        }

        String token = jwtService.generateToken(
                customer.getId(),
                email,
                credential.getRole()
        );

        return new AuthResponse(
                customer.getId(),
                email,
                customer.getFirstName() + " " +
                        customer.getLastName(),
                token,
                credential.getRole()
        );
    }
}
