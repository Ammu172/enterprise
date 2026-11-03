package com.finbank.customer;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }
   public Customer updateCustomer(Long id, Customer updatedCustomer) {

    Customer existingCustomer = customerRepository.findById(id)
            .orElseThrow(() ->
                    new org.springframework.web.server.ResponseStatusException(
                            org.springframework.http.HttpStatus.NOT_FOUND,
                            "Customer not found"));

    existingCustomer.setFirstName(updatedCustomer.getFirstName());
    existingCustomer.setLastName(updatedCustomer.getLastName());
    existingCustomer.setEmail(updatedCustomer.getEmail());
    existingCustomer.setPhone(updatedCustomer.getPhone());

    return customerRepository.save(existingCustomer);
}

    public void deleteCustomer(Long id) {
    if (!customerRepository.existsById(id)) {
        throw new org.springframework.web.server.ResponseStatusException(
                org.springframework.http.HttpStatus.NOT_FOUND,
                "Customer not found");
    }

    customerRepository.deleteById(id);
}

}
