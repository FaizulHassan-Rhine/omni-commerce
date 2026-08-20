'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { connections as initialConnections } from '@/data/connections';
import { notifications as initialNotifications } from '@/data/notifications';
import { getInitialStudioLibrary } from '@/data/studio-library';
import { products as seedProducts } from '@/data/products';
import { campaigns as seedCampaigns } from '@/data/campaigns';

const AppContext = createContext(null);
const STUDIO_KEY = 'omni-studio-library';
const PRODUCTS_KEY = 'omni-catalog-products';
const CAMPAIGNS_KEY = 'omni-workspace-campaigns';
const MAX_STORED_STUDIO = 16;
const MAX_STORED_PRODUCTS = 40;
const MAX_STORED_CAMPAIGNS = 24;
const FALLBACK_ASSET = '/images/ad-square.jpg';

function isHeavyUrl(value) {
  return typeof value === 'string' && (value.startsWith('data:') || value.startsWith('blob:') || value.length > 2048);
}

function slimAsset(value) {
  return isHeavyUrl(value) ? FALLBACK_ASSET : value;
}

function withPublished(items = []) {
  return items.map((item) => ({
    ...item,
    published: item.published ?? (item.status === 'Approved' || item.status === 'Active'),
    image: slimAsset(item.image),
  }));
}

function slimProducts(items = []) {
  return withPublished(items).slice(0, MAX_STORED_PRODUCTS);
}

function slimCampaigns(items = []) {
  return items.slice(0, MAX_STORED_CAMPAIGNS).map((item) => ({
    ...item,
    published: item.published ?? (item.status === 'Active' || item.status === 'Completed'),
  }));
}

function slimStudioAssets(items = []) {
  return items.slice(0, MAX_STORED_STUDIO).map((item) => ({
    ...item,
    src: slimAsset(item.src),
  }));
}

function readJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeJson(key, value) {
  const payload = JSON.stringify(value);
  try {
    localStorage.setItem(key, payload);
    return true;
  } catch {
    try {
      localStorage.removeItem(key);
      localStorage.setItem(key, payload);
      return true;
    } catch {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
      return false;
    }
  }
}

const AppProvider = function AppProvider({ children }) {
  const [connections, setConnections] = useState(initialConnections);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [studioAssets, setStudioAssets] = useState(getInitialStudioLibrary());
  const [studioReady, setStudioReady] = useState(false);
  const [catalogProducts, setCatalogProducts] = useState(() => slimProducts(seedProducts));
  const [workspaceCampaigns, setWorkspaceCampaigns] = useState(() => slimCampaigns(seedCampaigns));
  const [catalogReady, setCatalogReady] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const storedStudio = readJson(STUDIO_KEY);
    if (storedStudio?.length) setStudioAssets(slimStudioAssets(storedStudio));
    const storedProducts = readJson(PRODUCTS_KEY);
    if (storedProducts?.length) setCatalogProducts(slimProducts(storedProducts));
    const storedCampaigns = readJson(CAMPAIGNS_KEY);
    if (storedCampaigns?.length) setWorkspaceCampaigns(slimCampaigns(storedCampaigns));
    setStudioReady(true);
    setCatalogReady(true);
  }, []);

  useEffect(() => {
    if (!studioReady) return;
    writeJson(STUDIO_KEY, slimStudioAssets(studioAssets));
  }, [studioAssets, studioReady]);

  useEffect(() => {
    if (!catalogReady) return;
    writeJson(PRODUCTS_KEY, slimProducts(catalogProducts));
  }, [catalogProducts, catalogReady]);

  useEffect(() => {
    if (!catalogReady) return;
    writeJson(CAMPAIGNS_KEY, slimCampaigns(workspaceCampaigns));
  }, [workspaceCampaigns, catalogReady]);

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

  const upsertProduct = useCallback((product) => {
    const next = {
      ...product,
      id: product.id || `prod-${Date.now()}`,
      published: product.published === true,
      image: slimAsset(product.image) || FALLBACK_ASSET,
    };
    setCatalogProducts((prev) => {
      const exists = prev.some((item) => item.id === next.id);
      return exists
        ? prev.map((item) => (item.id === next.id ? { ...item, ...next } : item))
        : [next, ...prev].slice(0, MAX_STORED_PRODUCTS);
    });
    return next;
  }, []);

  const updateProduct = useCallback((id, patch) => {
    setCatalogProducts((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const upsertCampaign = useCallback((campaign) => {
    const next = {
      ...campaign,
      id: campaign.id || `camp-${Date.now()}`,
      published: campaign.published === true,
    };
    setWorkspaceCampaigns((prev) => {
      const exists = prev.some((item) => item.id === next.id);
      return exists
        ? prev.map((item) => (item.id === next.id ? { ...item, ...next } : item))
        : [next, ...prev].slice(0, MAX_STORED_CAMPAIGNS);
    });
    return next;
  }, []);

  const updateCampaign = useCallback((id, patch) => {
    setWorkspaceCampaigns((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
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
    setStudioAssets((prev) => [...created, ...prev].slice(0, MAX_STORED_STUDIO));
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
        toasts,
        catalogProducts,
        workspaceCampaigns,
        upsertProduct,
        updateProduct,
        upsertCampaign,
        updateCampaign,
        connectPlatform,
        disconnectPlatform,
        markNotificationRead,
        markAllNotificationsRead,
        addToast,
        removeToast,
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
