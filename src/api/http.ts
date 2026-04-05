import axios, { type AxiosError } from 'axios';
import type { ApiEnvelope } from './types';

const SESSION_KEY = 'rider_session';

const redirectToLogin = (): void => {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(SESSION_KEY);
  if (window.location.pathname !== '/login') {
    window.location.replace(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
  }
};

export const http = axios.create({
  baseURL: import.meta.env.VITE_RIDER_API_BASE || '/api',
  timeout: 15000
});

http.interceptors.request.use((config) => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return config;
  }
  try {
    const session = JSON.parse(raw) as { accessToken?: string };
    if (session.accessToken) {
      config.headers.Authorization = session.accessToken;
    }
  } catch {
    localStorage.removeItem(SESSION_KEY);
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    const payload = response.data as ApiEnvelope<unknown>;
    if (!payload || typeof payload.code !== 'number') {
      return response.data;
    }
    if (payload.code !== 200 && payload.code !== 0) {
      if (payload.code === 401 || `${payload.desc ?? ''}${payload.msg ?? ''}`.includes('未登录')) {
        redirectToLogin();
      }
      throw new Error(payload.desc || payload.msg || payload.enDesc || `Request failed: ${payload.code}`);
    }
    return payload.data;
  },
  (error: AxiosError<{ desc?: string; msg?: string }>) => {
    if (error.response?.status === 401) {
      redirectToLogin();
    }
    const message = error.response?.data?.desc || error.response?.data?.msg || error.message;
    return Promise.reject(new Error(message));
  }
);
