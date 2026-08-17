'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { connections as initialConnections } from '@/data/connections';
import { notifications as initialNotifications } from '@/data/notifications';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [connections, setConnections] = useState(initialConnections);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const connectPlatform = useCallback((platformId, accountName) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.platformId === platformId
          ? { ...c, connected: true, account: accountName, lastSync: new Date().toISOString() }
          : c
      )
    );
    addToast('success', 'Platform connected successfully');
  }, [addToast]);

  const disconnectPlatform = useCallback((platformId) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.platformId === platformId
          ? { ...c, connected: false, account: null, lastSync: null }
          : c
      )
    );
    addToast('info', 'Platform disconnected');
  }, [addToast]);

  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        connections,
        notifications,
        toasts,
        connectPlatform,
        disconnectPlatform,
        markNotificationRead,
        markAllNotificationsRead,
        addToast,
        removeToast,
        unreadCount: notifications.filter((n) => !n.read).length,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
