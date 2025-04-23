/**
 * 가격을 원화 형식으로 포맷팅 (1000 -> 1,000원)
 */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()}원`;
};

/**
 * 할인율을 퍼센트 형식으로 포맷팅 (0.1 -> 10%)
 */
export const formatDiscountRate = (rate: number): string => {
  return `${(rate * 100).toFixed(0)}%`;
};
