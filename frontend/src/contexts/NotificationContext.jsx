import React, { createContext, useContext, useState } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = (message, type = 'success', duration = 4000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type, duration }]);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            {notifications.map(({ id, message, type, duration }) => (
                <Notification
                    key={id}
                    message={message}
                    type={type}
                    duration={duration}
                    onClose={() => removeNotification(id)}
                />
            ))}
        </NotificationContext.Provider>
    );
};