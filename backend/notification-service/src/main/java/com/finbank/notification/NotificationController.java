package com.finbank.notification;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getAllNotifications(
            @AuthenticationPrincipal Jwt jwt) {

        if (!isAdmin(jwt)) {
            throw new org.springframework.web.server.ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Admin access required");
        }

        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public Notification getNotificationById(
            @PathVariable Long id,
            @AuthenticationPrincipal Jwt jwt) {

        return notificationService.getNotificationById(
                id, getCustomerId(jwt), isAdmin(jwt));
    }

    @GetMapping("/customer/{customerId}")
    public List<Notification> getNotificationsByCustomerId(
            @PathVariable Long customerId,
            @AuthenticationPrincipal Jwt jwt) {

        return notificationService.getNotificationsByCustomerId(
                customerId, getCustomerId(jwt), isAdmin(jwt));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification createNotification(
            @Valid @RequestBody Notification notification,
            @AuthenticationPrincipal Jwt jwt) {

        return notificationService.createNotification(
                notification, getCustomerId(jwt), isAdmin(jwt));
    }

    private Long getCustomerId(Jwt jwt) {
        return Long.valueOf(jwt.getSubject());
    }

    private boolean isAdmin(Jwt jwt) {
        return "ADMIN".equals(jwt.getClaimAsString("role"));
    }
}
