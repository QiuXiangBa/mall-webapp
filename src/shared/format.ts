export const formatMoney = (cents?: number): string => {
  const value = typeof cents === 'number' ? cents / 100 : 0;
  return `¥${value.toFixed(2)}`;
};

export const formatDateTime = (value?: string): string => {
  if (!value) {
    return '--';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(date);
};

export const formatTimeWindow = (displayText?: string, dateText?: string, slotText?: string): string => {
  if (displayText) {
    return displayText;
  }
  return [dateText, slotText].filter(Boolean).join(' · ') || '--';
};
