<template>
  <div class="page-shell">
    <van-nav-bar left-arrow left-text="返回" title="配送单详情" @click-left="router.back()" />

    <div class="page-shell__body">
      <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>

      <div v-if="ordersStore.detailLoading" class="loading-wrap">
        <van-loading size="24px">正在加载配送详情...</van-loading>
      </div>

      <template v-else-if="detail">
        <section class="detail-hero">
          <div>
            <p class="detail-hero__no">{{ detail.orderNo || `订单 #${orderId}` }}</p>
            <p class="detail-hero__status">{{ detail.fulfillmentStatusText }}</p>
          </div>
          <p class="detail-hero__amount">{{ formatMoney(detail.payAmount) }}</p>
        </section>

        <van-cell-group inset class="section-group">
          <van-cell title="配送参考号" :value="detail.dispatchRefNo || '--'" />
          <van-cell title="订单件数" :value="String(detail.itemCount)" />
          <van-cell title="收货人" :value="detail.receiverName || '--'" />
          <van-cell title="联系电话" :value="detail.deliveryPhone || '--'" />
          <van-cell title="收货地址" :label="detail.deliveryAddress || '--'" />
          <van-cell
            title="配送时间"
            :label="formatTimeWindow(detail.fulfillmentTimeWindow?.displayText, detail.fulfillmentTimeWindow?.dateText, detail.fulfillmentTimeWindow?.slotText)"
          />
          <van-cell title="配送选项" :value="detail.deliveryOption || '--'" />
          <van-cell title="配送备注" :label="detail.deliveryInstructions || '暂无备注'" />
          <van-cell title="交接时间" :value="formatDateTime(detail.handoffTime)" />
          <van-cell title="已送达时间" :value="formatDateTime(detail.deliveredTime)" />
        </van-cell-group>

        <div class="action-row" v-if="canStart || canDeliver">
          <van-button
            v-if="canStart"
            type="primary"
            round
            block
            :loading="ordersStore.actionLoading === 'start'"
            :disabled="ordersStore.actionLoading !== null"
            @click="handleStart"
          >
            开始配送
          </van-button>
          <van-button
            v-if="canDeliver"
            type="primary"
            round
            block
            :loading="ordersStore.actionLoading === 'delivered'"
            :disabled="ordersStore.actionLoading !== null"
            @click="handleDelivered"
          >
            标记已送达
          </van-button>
        </div>

        <section class="timeline-panel">
          <div class="timeline-panel__header">
            <h2>配送轨迹</h2>
            <p>{{ detail.latestNode || '暂无节点更新' }}</p>
          </div>
          <van-empty v-if="detail.nodes.length === 0" description="暂无配送轨迹" />
          <div v-else class="timeline-steps-wrap">
            <van-steps direction="vertical" :active="0" active-color="#ff6a2a">
              <van-step v-for="(node, index) in detail.nodes" :key="`${node.nodeTime}-${index}`">
                <template #active-icon>
                  <van-icon name="checked" />
                </template>
                <h3 class="timeline-node__desc">{{ node.nodeDesc }}</h3>
                <p class="timeline-node__time">{{ formatDateTime(node.nodeTime) }}</p>
              </van-step>
            </van-steps>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { showConfirmDialog, showFailToast, showSuccessToast } from 'vant';
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
  try {
    await showConfirmDialog({
      title: '开始配送',
      message: '确认开始配送这笔订单吗？',
      confirmButtonText: '确认开始',
      cancelButtonText: '再等等'
    });
  } catch {
    return;
  }
  try {
    await ordersStore.start(orderId.value);
    showSuccessToast('已开始配送');
  } catch (error) {
    const message = error instanceof Error ? error.message : '开始配送失败';
    errorMessage.value = message;
    showFailToast(message);
  }
};

const handleDelivered = async () => {
  try {
    await showConfirmDialog({
      title: '标记已送达',
      message: '确认标记这笔订单为已送达吗？',
      confirmButtonText: '确认送达',
      cancelButtonText: '再等等'
    });
  } catch {
    return;
  }
  try {
    await ordersStore.markDelivered(orderId.value);
    showSuccessToast('已标记为已送达');
  } catch (error) {
    const message = error instanceof Error ? error.message : '标记已送达失败';
    errorMessage.value = message;
    showFailToast(message);
  }
};

onMounted(async () => {
  await loadDetail();
});
</script>
