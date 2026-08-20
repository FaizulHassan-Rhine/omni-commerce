'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { connections as initialConnections } from '@/data/connections';
import { notifications as initialNotifications } from '@/data/notifications';
import { approvals as initialApprovals } from '@/data/approvals';
import { getInitialStudioLibrary } from '@/data/studio-library';

const AppContext = createContext(null);
const APPROVALS_KEY = 'omni-approvals';
const STUDIO_KEY = 'omni-studio-library';

function readStoredApprovals() {
  try {
    const raw = localStorage.getItem(APPROVALS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readStoredStudioLibrary() {
  try {
    const raw = localStorage.getItem(STUDIO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AppProvider = function AppProvider({ children }) {
  const [connections, setConnections] = useState(initialConnections);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [approvals, setApprovals] = useState(initialApprovals);
  const [approvalsReady, setApprovalsReady] = useState(false);
  const [studioAssets, setStudioAssets] = useState(getInitialStudioLibrary());
  const [studioReady, setStudioReady] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const stored = readStoredApprovals();
    if (stored?.length) setApprovals(stored);
    const storedStudio = readStoredStudioLibrary();
    if (storedStudio?.length) setStudioAssets(storedStudio);
    setApprovalsReady(true);
    setStudioReady(true);
  }, []);

  useEffect(() => {
    if (!approvalsReady) return;
    localStorage.setItem(APPROVALS_KEY, JSON.stringify(approvals));
  }, [approvals, approvalsReady]);

  useEffect(() => {
    if (!studioReady) return;
    localStorage.setItem(STUDIO_KEY, JSON.stringify(studioAssets));
  }, [studioAssets, studioReady]);

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

  const submitApprovals = useCallback((items, creator = 'Alex Morgan') => {
    const created = items.map((item, index) => ({
      id: `appr-${Date.now()}-${index}`,
      type: item.type || 'content',
      asset: item.asset,
      assetName: item.assetName,
      campaign: item.campaign,
      platform: item.platform || null,
      creator,
      reviewer: 'Pending reviewer',
      status: 'Awaiting Review',
      createdDate: new Date().toISOString(),
      comments: [],
      sourceId: item.sourceId || null,
    }));
    setApprovals((prev) => [...created, ...prev]);
    return created;
  }, []);

  const updateApproval = useCallback((id, patch) => {
    setApprovals((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const addStudioAssets = useCallback((items) => {
    const created = items.map((item, index) => ({
      id: item.id || `gen-${Date.now()}-${index}`,
      type: item.type,
      src: item.src,
      source: item.source || 'generated',
      sourceId: item.sourceId || null,
      name: item.name || (item.type === 'video' ? 'Generated video' : 'Generated image'),
      createdAt: new Date().toISOString().slice(0, 10),
      imageScale: item.imageScale ?? 100,
      imageOffsetX: item.imageOffsetX ?? 0,
      imageOffsetY: item.imageOffsetY ?? 0,
      imageBrightness: item.imageBrightness ?? 100,
      imageContrast: item.imageContrast ?? 100,
    }));
    setStudioAssets((prev) => [...created, ...prev]);
    return created;
  }, []);

  const updateStudioAsset = useCallback((id, patch) => {
    setStudioAssets((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  return (
    <AppContext.Provider
      value={{
        connections,
        notifications,
        approvals,
        toasts,
        connectPlatform,
        disconnectPlatform,
        markNotificationRead,
        markAllNotificationsRead,
        addToast,
        removeToast,
        submitApprovals,
        updateApproval,
        studioAssets,
        addStudioAssets,
        updateStudioAsset,
        unreadCount: notifications.filter((n) => !n.read).length,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
