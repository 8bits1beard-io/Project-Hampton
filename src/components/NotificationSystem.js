import React, { useEffect } from 'react';

const NotificationSystem = ({ notifications, onDismiss }) => {
  return (
    <div className="notification-system">
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          notification={notification}
          onDismiss={() => onDismiss(notification.id)}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onDismiss }) => {
  useEffect(() => {
    // Auto-dismiss after 5 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className={`notification ${notification.type}`}>
      <div className="notification-content">
        <span className="notification-icon">
          {getNotificationIcon(notification.type)}
        </span>
        <span className="notification-message">
          {notification.message}
        </span>
      </div>
      <button className="notification-close" onClick={onDismiss}>
        ×
      </button>
    </div>
  );
};

export default NotificationSystem;