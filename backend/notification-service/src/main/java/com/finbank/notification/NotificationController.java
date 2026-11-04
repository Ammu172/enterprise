package com.finbank.notification;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
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
    public List<Notification> getAllNotifications() {
        return notificationService.getAllNotifications();
    }

    @GetMapping("/{id}")
    public Notification getNotificationById(@PathVariable Long id) {
        return notificationService.getNotificationById(id);
    }

    @GetMapping("/customer/{customerId}")
    public List<Notification> getNotificationsByCustomerId(
            @PathVariable Long customerId) {
        return notificationService.getNotificationsByCustomerId(customerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification createNotification(
            @Valid @RequestBody Notification notification) {
        return notificationService.createNotification(notification);
    }
}
