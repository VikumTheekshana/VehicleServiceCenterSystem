'use client';

import { useState, useEffect } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'DIRECTOR' | 'SERVICE_ADVISOR' | 'TECHNICIAN' | 'EV_SPECIALIST' | 'STOREKEEPER' | 'SECURITY_GUARD';
  phone?: string;
  lastLoginAt?: string;
}

const TOKEN_KEY = 'autoos_auth_token';
const USER_KEY = 'autoos_auth_user';
const AUTH_EVENT = 'autoos_auth_state_changed';

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: UserProfile): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function clearAuthSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Login failed. Please check your credentials.');
  }

  setAuthSession(data.token, data.user);
  return data;
}

export async function registerUser(payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Registration failed.');
  }

  setAuthSession(data.token, data.user);
  return data;
}

export function logoutUser(): void {
  clearAuthSession();
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const syncState = () => {
      setUser(getStoredUser());
      setToken(getStoredToken());
      setLoading(false);
    };

    syncState();
    window.addEventListener(AUTH_EVENT, syncState);
    window.addEventListener('storage', syncState);

    return () => {
      window.removeEventListener(AUTH_EVENT, syncState);
      window.removeEventListener('storage', syncState);
    };
  }, []);

  return { user, token, loading, isAuthenticated: !!token && !!user };
}
