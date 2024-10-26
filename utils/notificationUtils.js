// notificationUtils.js
export const countUnreadNotifications = (notifications) => {
    return notifications.filter(notification => !notification.read).length;
};
