<template>
  <div class="auth-page">
    <div class="auth-card">
      <p class="auth-eyebrow">ZipGO Rider</p>
      <h1 class="auth-title">骑手登录</h1>
      <p class="auth-subtitle">使用手机号和密码登录，查看分配给你的配送单。</p>
      <form class="auth-form" @submit.prevent="handleSubmit">
        <label class="field">
          <span>手机号</span>
          <input v-model.trim="mobile" inputmode="numeric" autocomplete="tel" placeholder="请输入手机号" />
        </label>
        <label class="field">
          <span>密码</span>
          <input v-model="password" type="password" autocomplete="current-password" placeholder="请输入密码" />
        </label>
        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
        <button class="primary-button" type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const mobile = ref('');
const password = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  errorMessage.value = '';
  if (!mobile.value || !password.value) {
    errorMessage.value = '请输入手机号和密码';
    return;
  }
  try {
    await authStore.login(mobile.value, password.value);
    await authStore.refreshMe();
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/orders';
    await router.replace(redirect);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '登录失败，请稍后重试';
  }
};
</script>
