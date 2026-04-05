<template>
  <div class="login-shell">
    <div class="login-hero">
      <p class="login-kicker">ZipGO Rider</p>
      <h1 class="login-title">骑手登录</h1>
      <p class="login-subtitle">使用手机号和密码登录，查看分配给你的配送单。</p>
    </div>

    <van-form class="login-form" @submit="handleSubmit">
      <van-cell-group inset>
        <van-field
          v-model.trim="mobile"
          name="mobile"
          label="手机号"
          input-align="right"
          inputmode="numeric"
          autocomplete="tel"
          placeholder="请输入手机号"
          clearable
        />
        <van-field
          v-model="password"
          name="password"
          label="密码"
          type="password"
          input-align="right"
          autocomplete="current-password"
          placeholder="请输入密码"
          clearable
        />
      </van-cell-group>

      <div v-if="errorMessage" class="form-error">{{ errorMessage }}</div>

      <div class="login-submit">
        <van-button round block type="primary" native-type="submit" :loading="authStore.loading">
          登录
        </van-button>
      </div>
    </van-form>
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
