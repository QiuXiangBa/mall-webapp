import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { deliverRiderOrder, fetchRiderOrderDetail, fetchRiderOrderPage, startRiderOrder } from '@/api/orders';
import type { RiderOrderDetail, RiderOrderListItem } from '@/api/types';

export const useRiderOrdersStore = defineStore('rider-orders', () => {
  const items = ref<RiderOrderListItem[]>([]);
  const total = ref(0);
  const pageNum = ref(1);
  const pageSize = ref(20);
  const status = ref<number | undefined>(undefined);
  const loading = ref(false);
  const loadingMore = ref(false);
  const detailLoading = ref(false);
  const actionLoading = ref<'start' | 'delivered' | null>(null);
  const detail = ref<RiderOrderDetail | null>(null);

  const hasMore = computed(() => items.value.length < total.value);

  const fetchFirstPage = async (nextStatus?: number) => {
    status.value = nextStatus;
    pageNum.value = 1;
    loading.value = true;
    try {
      const page = await fetchRiderOrderPage({
        pageNum: pageNum.value,
        pageSize: pageSize.value,
        status: status.value
      });
      items.value = page.list;
      total.value = page.total;
    } finally {
      loading.value = false;
    }
  };

  const loadMore = async () => {
    if (!hasMore.value || loadingMore.value) {
      return;
    }
    loadingMore.value = true;
    try {
      const nextPageNum = pageNum.value + 1;
      const page = await fetchRiderOrderPage({
        pageNum: nextPageNum,
        pageSize: pageSize.value,
        status: status.value
      });
      pageNum.value = nextPageNum;
      items.value = [...items.value, ...page.list];
      total.value = page.total;
    } finally {
      loadingMore.value = false;
    }
  };

  const fetchDetail = async (orderId: number) => {
    detailLoading.value = true;
    try {
      detail.value = await fetchRiderOrderDetail(orderId);
      return detail.value;
    } finally {
      detailLoading.value = false;
    }
  };

  const refreshList = async () => {
    await fetchFirstPage(status.value);
  };

  const start = async (orderId: number, remark?: string) => {
    actionLoading.value = 'start';
    try {
      await startRiderOrder(orderId, remark);
      await Promise.all([fetchDetail(orderId), refreshList()]);
    } finally {
      actionLoading.value = null;
    }
  };

  const markDelivered = async (orderId: number, remark?: string) => {
    actionLoading.value = 'delivered';
    try {
      await deliverRiderOrder(orderId, remark);
      await Promise.all([fetchDetail(orderId), refreshList()]);
    } finally {
      actionLoading.value = null;
    }
  };

  return {
    items,
    total,
    status,
    loading,
    loadingMore,
    detailLoading,
    actionLoading,
    detail,
    hasMore,
    fetchFirstPage,
    loadMore,
    fetchDetail,
    start,
    markDelivered
  };
});
