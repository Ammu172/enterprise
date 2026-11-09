package com.finbank.notification;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    public Notification getNotificationById(Long id, Long customerId, boolean isAdmin) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Notification not found"));

        if (!isAdmin && !notification.getCustomerId().equals(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Not authorized to access this notification");
        }

        return notification;
    }

    public List<Notification> getNotificationsByCustomerId(
            Long requestedCustomerId, Long customerId, boolean isAdmin) {

        if (!isAdmin && !requestedCustomerId.equals(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Not authorized to access these notifications");
        }

        return notificationRepository.findByCustomerId(requestedCustomerId);
    }

    public Notification createNotification(
            Notification notification, Long customerId, boolean isAdmin) {

        if (!isAdmin && !notification.getCustomerId().equals(customerId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN, "Cannot create notification for another customer");
        }

        notification.setStatus("CREATED");
        return notificationRepository.save(notification);
    }
}
