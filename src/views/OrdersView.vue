<template>
  <div class="page-shell">
    <van-nav-bar title="我的配送单">
      <template #right>
        <van-button size="small" plain type="primary" @click="handleLogout">退出</van-button>
      </template>
    </van-nav-bar>

    <div class="page-shell__body">
      <div class="summary-panel">
        <div>
          <p class="summary-panel__kicker">ZipGO Rider</p>
          <h1 class="summary-panel__title">欢迎回来</h1>
          <p class="summary-panel__subtitle">{{ authStore.session?.nickname || authStore.session?.mobile }}，优先处理待派送订单。</p>
        </div>
      </div>

      <van-tabs v-model:active="activeTab" animated swipeable @change="handleTabChange">
        <van-tab v-for="option in statusOptions" :key="option.key" :title="option.label" />
      </van-tabs>

      <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>

      <div v-if="ordersStore.loading && ordersStore.items.length === 0" class="loading-wrap">
        <van-loading size="24px">正在加载配送单...</van-loading>
      </div>
      <van-empty v-else-if="!ordersStore.loading && ordersStore.items.length === 0" description="当前没有配送单" />

      <div v-else class="orders-panel">
        <van-list
          v-model:loading="listLoading"
          :finished="!ordersStore.hasMore"
          finished-text="没有更多配送单了"
          loading-text="正在加载更多配送单..."
          :immediate-check="false"
          @load="handleLoadMore"
        >
          <van-cell-group inset>
            <van-cell
              v-for="item in ordersStore.items"
              :key="item.orderId"
              is-link
              center
              class="order-cell"
              @click="goDetail(item.orderId)"
            >
              <template #title>
                <div class="order-cell__title">{{ item.orderNo }}</div>
                <div class="order-cell__time">
                  {{ formatTimeWindow(item.fulfillmentTimeWindow?.displayText, item.fulfillmentTimeWindow?.dateText, item.fulfillmentTimeWindow?.slotText) }}
                </div>
              </template>
              <template #label>
                <div class="order-cell__address">{{ item.deliveryAddress || '地址待补充' }}</div>
                <div class="order-cell__meta">
                  <span>联系电话：{{ item.deliveryPhone || '--' }}</span>
                  <span>配送参考号：{{ item.dispatchRefNo || '--' }}</span>
                </div>
                <div class="order-cell__node">{{ item.latestNode || '等待处理' }}</div>
              </template>
              <template #value>
                <van-tag plain type="primary">{{ item.fulfillmentStatusText }}</van-tag>
              </template>
            </van-cell>
          </van-cell-group>
        </van-list>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useRiderOrdersStore } from '@/stores/rider-orders';
import { formatTimeWindow } from '@/shared/format';

const router = useRouter();
const authStore = useAuthStore();
const ordersStore = useRiderOrdersStore();

const activeTab = ref(0);
const errorMessage = ref('');
const listLoading = ref(false);

const statusOptions = [
  { key: 'all', label: '全部', value: undefined },
  { key: 'wait_handoff', label: '待派送', value: 10 },
  { key: 'in_progress', label: '派送中', value: 20 },
  { key: 'delivered', label: '已送达', value: 30 },
  { key: 'fulfilled', label: '已完成', value: 40 },
  { key: 'closed', label: '已关闭', value: 90 }
];

const loadOrders = async (status?: number) => {
  errorMessage.value = '';
  try {
    await ordersStore.fetchFirstPage(status);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载配送单失败';
  } finally {
    listLoading.value = false;
  }
};

const handleTabChange = async (index: number) => {
  activeTab.value = index;
  await loadOrders(statusOptions[index]?.value);
};

const handleLoadMore = async () => {
  if (!ordersStore.hasMore || ordersStore.loadingMore) {
    listLoading.value = false;
    return;
  }
  errorMessage.value = '';
  try {
    await ordersStore.loadMore();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载更多配送单失败';
  } finally {
    listLoading.value = false;
  }
};

const goDetail = async (orderId: number) => {
  await router.push({ name: 'order-detail', params: { id: orderId } });
};

const handleLogout = async () => {
  await authStore.logout();
  await router.replace({ name: 'login' });
};

onMounted(async () => {
  await loadOrders(statusOptions[activeTab.value]?.value);
});

watch(
  () => ordersStore.loadingMore,
  (value) => {
    listLoading.value = value;
  }
);
</script>
