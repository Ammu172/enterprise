package com.finbank.notification;

import org.springframework.stereotype.Service;
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

    public Notification getNotificationById(Long id) {
        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found"));
    }

    public List<Notification> getNotificationsByCustomerId(Long customerId) {
        return notificationRepository.findByCustomerId(customerId);
    }

    public Notification createNotification(Notification notification) {
        notification.setStatus("CREATED");
        return notificationRepository.save(notification);
    }
}
