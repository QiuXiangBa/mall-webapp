import { http } from './http';
import type { PageResp, RiderOrderDetail, RiderOrderListItem } from './types';

export const fetchRiderOrderPage = async (params: {
  pageNum: number;
  pageSize: number;
  status?: number;
}): Promise<PageResp<RiderOrderListItem>> => {
  return http.get('/rider/order/page', { params });
};

export const fetchRiderOrderDetail = async (orderId: number): Promise<RiderOrderDetail> => {
  return http.get('/rider/order/detail', {
    params: { orderId }
  });
};

export const startRiderOrder = async (orderId: number, remark?: string): Promise<void> => {
  await http.post('/rider/order/start', {
    orderId,
    remark
  });
};

export const deliverRiderOrder = async (orderId: number, remark?: string): Promise<void> => {
  await http.post('/rider/order/delivered', {
    orderId,
    remark
  });
};
