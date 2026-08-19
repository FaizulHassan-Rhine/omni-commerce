'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { demoAccount } from '@/data/auth';

const AuthContext = createContext(null);
const SESSION_KEY = 'omni-auth-session';
const USERS_KEY = 'omni-auth-users';

function readUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
    setReady(true);
  }, []);

  const persistSession = (session) => {
    setUser(session);
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  };

  const login = useCallback((email, password) => {
    const normalized = email.trim().toLowerCase();
    if (normalized === demoAccount.email && password === demoAccount.password) {
      persistSession({
        name: demoAccount.name,
        email: demoAccount.email,
        role: demoAccount.role,
      });
      return { ok: true };
    }

    const match = readUsers().find(
      (u) => u.email.toLowerCase() === normalized && u.password === password
    );
    if (!match) {
      return { ok: false, error: 'Invalid email or password. Try the demo account below.' };
    }

    persistSession({ name: match.name, email: match.email, role: match.role || 'Member' });
    return { ok: true };
  }, []);

  const signup = useCallback(({ name, email, password }) => {
    const normalized = email.trim().toLowerCase();
    if (!name.trim() || !normalized || !password) {
      return { ok: false, error: 'Please fill in all fields.' };
    }
    if (password.length < 6) {
      return { ok: false, error: 'Password must be at least 6 characters.' };
    }
    if (normalized === demoAccount.email) {
      return { ok: false, error: 'That email is reserved for the demo account. Please sign in instead.' };
    }

    const users = readUsers();
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return { ok: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const nextUser = {
      name: name.trim(),
      email: normalized,
      password,
      role: 'Growth Manager',
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, nextUser]));
    persistSession({ name: nextUser.name, email: nextUser.email, role: nextUser.role });
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, ready, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
