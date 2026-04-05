import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { fetchMe, login as loginApi, logout as logoutApi } from '@/api/auth';
import type { RiderSession } from '@/api/types';

const SESSION_KEY = 'rider_session';

const readSession = (): RiderSession | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as RiderSession;
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

export const useAuthStore = defineStore('auth', () => {
  const session = ref<RiderSession | null>(null);
  const restored = ref(false);
  const loading = ref(false);

  const isLoggedIn = computed(() => Boolean(session.value?.accessToken));

  const persist = () => {
    if (session.value) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session.value));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  };

  const restore = () => {
    if (restored.value) {
      return;
    }
    session.value = readSession();
    restored.value = true;
  };

  const login = async (mobile: string, password: string) => {
    loading.value = true;
    try {
      const result = await loginApi(mobile, password);
      session.value = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresTime: result.expiresTime,
        userId: result.user.userId,
        username: result.user.username,
        nickname: result.user.nickname,
        mobile: result.user.mobile,
        avatar: result.user.avatar
      };
      persist();
      return session.value;
    } finally {
      loading.value = false;
    }
  };

  const refreshMe = async () => {
    if (!session.value?.accessToken) {
      return null;
    }
    const me = await fetchMe();
    session.value = {
      ...session.value,
      userId: me.userId,
      username: me.username,
      nickname: me.nickname,
      mobile: me.mobile,
      avatar: me.avatar
    };
    persist();
    return session.value;
  };

  const logout = async () => {
    try {
      if (session.value?.accessToken) {
        await logoutApi();
      }
    } catch {
      // 中文：登出接口失败时仍清理本地登录态，避免骑手卡在脏 token 上。
      // English: Always clear local auth state even if logout API fails.
    } finally {
      session.value = null;
      persist();
    }
  };

  return {
    session,
    restored,
    loading,
    isLoggedIn,
    restore,
    login,
    refreshMe,
    logout
  };
});
