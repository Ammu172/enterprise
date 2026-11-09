package com.finbank.customer;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public List<Customer> getAllCustomers() {
        return customerService.getAllCustomers();
    }

    @GetMapping("/{id}")
public Customer getCustomerById(
        @PathVariable Long id,
        Authentication authentication) {

    boolean isAdminOrService = authentication.getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .anyMatch(role ->
                    role.equals("ROLE_ADMIN")
                    || role.equals("ROLE_SERVICE_ACCOUNT"));

    if (!isAdminOrService &&
            !authentication.getName().equals(id.toString())) {
        throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.FORBIDDEN, "You cannot access another customer's profile");
    }

    return customerService.getCustomerById(id)
            .orElseThrow(() ->
                    new org.springframework.web.server.ResponseStatusException(
                            HttpStatus.NOT_FOUND, "Customer not found"));
}

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Customer createCustomer(@Valid @RequestBody Customer customer) {
        return customerService.createCustomer(customer);
    }

@PutMapping("/{id}")
public Customer updateCustomer(
        @PathVariable Long id,
        @Valid @RequestBody Customer customer) {

    return customerService.updateCustomer(id, customer);
}


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
    }
}
