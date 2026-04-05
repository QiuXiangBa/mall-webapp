<template>
  <div class="app-shell">
    <header class="app-header">
      <div>
        <p class="page-kicker">ZipGO Rider</p>
        <h1 class="page-title">我的配送单</h1>
        <p class="page-subtitle">{{ authStore.session?.nickname || authStore.session?.mobile }}，优先处理待派送订单。</p>
      </div>
      <button class="ghost-button" type="button" @click="handleLogout">退出登录</button>
    </header>

    <div class="status-tabs">
      <button
        v-for="option in statusOptions"
        :key="option.value ?? 'all'"
        class="status-tab"
        :class="{ active: selectedStatus === option.value }"
        type="button"
        @click="changeStatus(option.value)"
      >
        {{ option.label }}
      </button>
    </div>

    <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>

    <div v-if="ordersStore.loading" class="empty-state">正在加载配送单...</div>
    <div v-else-if="ordersStore.items.length === 0" class="empty-state">当前没有配送单</div>

    <div v-else class="order-list">
      <article v-for="item in ordersStore.items" :key="item.orderId" class="order-card" @click="goDetail(item.orderId)">
        <div class="order-card-top">
          <div>
            <p class="order-no">{{ item.orderNo }}</p>
            <p class="order-meta">{{ formatTimeWindow(item.fulfillmentTimeWindow?.displayText, item.fulfillmentTimeWindow?.dateText, item.fulfillmentTimeWindow?.slotText) }}</p>
          </div>
          <span class="status-chip">{{ item.fulfillmentStatusText }}</span>
        </div>
        <p class="order-address">{{ item.deliveryAddress || '地址待补充' }}</p>
        <div class="order-grid">
          <div>
            <span class="muted-label">联系电话</span>
            <p>{{ item.deliveryPhone || '--' }}</p>
          </div>
          <div>
            <span class="muted-label">配送参考号</span>
            <p>{{ item.dispatchRefNo || '--' }}</p>
          </div>
        </div>
        <p class="latest-node">{{ item.latestNode || '等待处理' }}</p>
      </article>
    </div>

    <button v-if="ordersStore.hasMore" class="ghost-button full-width" type="button" :disabled="ordersStore.loadingMore" @click="ordersStore.loadMore">
      {{ ordersStore.loadingMore ? '加载中...' : '加载更多' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useRiderOrdersStore } from '@/stores/rider-orders';
import { formatTimeWindow } from '@/shared/format';

const router = useRouter();
const authStore = useAuthStore();
const ordersStore = useRiderOrdersStore();

const selectedStatus = ref<number | undefined>(undefined);
const errorMessage = ref('');

const statusOptions = [
  { label: '全部', value: undefined },
  { label: '待派送', value: 10 },
  { label: '派送中', value: 20 },
  { label: '已送达', value: 30 },
  { label: '已完成', value: 40 },
  { label: '已关闭', value: 90 }
];

const loadOrders = async (status?: number) => {
  errorMessage.value = '';
  try {
    await ordersStore.fetchFirstPage(status);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载配送单失败';
  }
};

const changeStatus = async (status?: number) => {
  selectedStatus.value = status;
  await loadOrders(status);
};

const goDetail = async (orderId: number) => {
  await router.push({ name: 'order-detail', params: { id: orderId } });
};

const handleLogout = async () => {
  await authStore.logout();
  await router.replace({ name: 'login' });
};

onMounted(async () => {
  await loadOrders(undefined);
});
</script>
