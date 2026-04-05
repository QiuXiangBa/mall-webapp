export interface ApiEnvelope<T> {
  code: number;
  desc?: string;
  enDesc?: string;
  msg?: string;
  data: T;
  success?: boolean;
}

export interface PageResp<T> {
  total: number;
  list: T[];
}

export interface AuthUser {
  userId: number;
  username: string;
  nickname: string;
  mobile: string;
  email?: string;
  avatar?: string;
}

export interface LoginResp {
  accessToken: string;
  refreshToken: string;
  expiresTime: number;
  user: AuthUser;
}

export interface RiderSession {
  accessToken: string;
  refreshToken?: string;
  expiresTime?: number;
  userId: number;
  username: string;
  nickname: string;
  mobile: string;
  avatar?: string;
}

export interface FulfillmentTimeWindow {
  date?: string;
  dateText?: string;
  slotCode?: string;
  slotText?: string;
  displayText?: string;
}

export interface RiderOrderListItem {
  orderId: number;
  orderNo: string;
  fulfillmentStatus: number;
  fulfillmentStatusText: string;
  dispatchRefNo?: string;
  latestNode?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  fulfillmentTimeWindow?: FulfillmentTimeWindow;
  handoffTime?: string;
  deliveredTime?: string;
}

export interface FulfillmentNode {
  fromStatus?: number;
  toStatus?: number;
  operateType?: number;
  nodeDesc: string;
  nodeTime?: string;
}

export interface RiderOrderDetail {
  orderId: number;
  orderNo: string;
  itemCount: number;
  payAmount: number;
  fulfillmentStatus: number;
  fulfillmentStatusText: string;
  dispatchRefNo?: string;
  latestNode?: string;
  receiverName?: string;
  deliveryPhone?: string;
  deliveryAddress?: string;
  deliveryOption?: string;
  deliveryInstructions?: string;
  fulfillmentTimeWindow?: FulfillmentTimeWindow;
  handoffTime?: string;
  deliveredTime?: string;
  nodes: FulfillmentNode[];
}
