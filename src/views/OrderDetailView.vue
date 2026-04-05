<template>
  <div class="app-shell">
    <header class="detail-header">
      <button class="back-button" type="button" @click="router.back()">返回</button>
      <div>
        <p class="page-kicker">配送单详情</p>
        <h1 class="page-title">{{ detail?.orderNo || `订单 #${orderId}` }}</h1>
      </div>
    </header>

    <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
    <div v-if="ordersStore.detailLoading" class="empty-state">正在加载配送详情...</div>
    <template v-else-if="detail">
      <section class="detail-card">
        <div class="detail-card-top">
          <span class="status-chip">{{ detail.fulfillmentStatusText }}</span>
          <p class="order-amount">{{ formatMoney(detail.payAmount) }}</p>
        </div>
        <div class="detail-grid">
          <div>
            <span class="muted-label">配送参考号</span>
            <p>{{ detail.dispatchRefNo || '--' }}</p>
          </div>
          <div>
            <span class="muted-label">订单件数</span>
            <p>{{ detail.itemCount }}</p>
          </div>
          <div>
            <span class="muted-label">收货人</span>
            <p>{{ detail.receiverName || '--' }}</p>
          </div>
          <div>
            <span class="muted-label">联系电话</span>
            <p>{{ detail.deliveryPhone || '--' }}</p>
          </div>
          <div class="detail-grid-wide">
            <span class="muted-label">收货地址</span>
            <p>{{ detail.deliveryAddress || '--' }}</p>
          </div>
          <div>
            <span class="muted-label">配送时间</span>
            <p>{{ formatTimeWindow(detail.fulfillmentTimeWindow?.displayText, detail.fulfillmentTimeWindow?.dateText, detail.fulfillmentTimeWindow?.slotText) }}</p>
          </div>
          <div>
            <span class="muted-label">配送选项</span>
            <p>{{ detail.deliveryOption || '--' }}</p>
          </div>
          <div class="detail-grid-wide">
            <span class="muted-label">配送备注</span>
            <p>{{ detail.deliveryInstructions || '暂无备注' }}</p>
          </div>
          <div>
            <span class="muted-label">交接时间</span>
            <p>{{ formatDateTime(detail.handoffTime) }}</p>
          </div>
          <div>
            <span class="muted-label">已送达时间</span>
            <p>{{ formatDateTime(detail.deliveredTime) }}</p>
          </div>
        </div>
        <div class="action-row" v-if="canStart || canDeliver">
          <button
            v-if="canStart"
            class="primary-button"
            type="button"
            :disabled="ordersStore.actionLoading !== null"
            @click="handleStart"
          >
            {{ ordersStore.actionLoading === 'start' ? '提交中...' : '开始配送' }}
          </button>
          <button
            v-if="canDeliver"
            class="primary-button"
            type="button"
            :disabled="ordersStore.actionLoading !== null"
            @click="handleDelivered"
          >
            {{ ordersStore.actionLoading === 'delivered' ? '提交中...' : '标记已送达' }}
          </button>
        </div>
      </section>

      <section class="timeline-card">
        <div class="timeline-header">
          <h2>配送轨迹</h2>
          <p>{{ detail.latestNode || '暂无节点更新' }}</p>
        </div>
        <div v-if="detail.nodes.length === 0" class="empty-state compact">暂无配送轨迹</div>
        <ol v-else class="timeline-list">
          <li v-for="(node, index) in detail.nodes" :key="`${node.nodeTime}-${index}`" class="timeline-item">
            <span class="timeline-dot"></span>
            <div>
              <p class="timeline-desc">{{ node.nodeDesc }}</p>
              <p class="timeline-time">{{ formatDateTime(node.nodeTime) }}</p>
            </div>
          </li>
        </ol>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRiderOrdersStore } from '@/stores/rider-orders';
import { formatDateTime, formatMoney, formatTimeWindow } from '@/shared/format';

const route = useRoute();
const router = useRouter();
const ordersStore = useRiderOrdersStore();

const errorMessage = ref('');
const orderId = computed(() => Number(route.params.id));
const detail = computed(() => ordersStore.detail);
const canStart = computed(() => detail.value?.fulfillmentStatus === 10);
const canDeliver = computed(() => detail.value?.fulfillmentStatus === 20);

const loadDetail = async () => {
  errorMessage.value = '';
  try {
    await ordersStore.fetchDetail(orderId.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '加载配送详情失败';
  }
};

const handleStart = async () => {
  if (!window.confirm('确认开始配送这笔订单吗？')) {
    return;
  }
  try {
    await ordersStore.start(orderId.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '开始配送失败';
  }
};

const handleDelivered = async () => {
  if (!window.confirm('确认标记为已送达吗？')) {
    return;
  }
  try {
    await ordersStore.markDelivered(orderId.value);
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '标记已送达失败';
  }
};

onMounted(async () => {
  await loadDetail();
});
</script>
