import { Coupon, Product } from "../../types.ts";
import { useCart } from "../hooks";
import { useProductDiscount } from "../hooks/useProductDiscount.ts";
import { formatDiscountRate, formatPrice } from "../utils/formatter.ts";

interface Props {
  products: Product[];
  coupons: Coupon[];
}

export const CartPage = ({ products, coupons }: Props) => {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    applyCoupon,
    calculateTotal,
    selectedCoupon,
  } = useCart();
  const { getMaxDiscount, getAppliedDiscount } = useProductDiscount();

  const getRemainingStock = (product: Product) => {
    const cartItem = cart.find((item) => item.product.id === product.id);
    return product.stock - (cartItem?.quantity || 0);
  };

  const { totalBeforeDiscount, totalAfterDiscount, totalDiscount } =
    calculateTotal();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">장바구니</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">상품 목록</h2>
          <div className="space-y-2">
            {products.map((product) => {
              const remainingStock = getRemainingStock(product);
              return (
                <div
                  key={product.id}
                  data-testid={`product-${product.id}`}
                  className="bg-white p-3 rounded shadow"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">{product.name}</span>
                    <span className="text-gray-600">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    <span
                      className={`font-medium ${
                        remainingStock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      재고: {remainingStock}개
                    </span>
                    {product.discounts.length > 0 && (
                      <span className="ml-2 font-medium text-blue-600">
                        최대{" "}
                        {formatDiscountRate(getMaxDiscount(product.discounts))}
                        할인
                      </span>
                    )}
                  </div>
                  {product.discounts.length > 0 && (
                    <ul className="list-disc list-inside text-sm text-gray-500 mb-2">
                      {product.discounts.map((discount, index) => (
                        <li key={index}>
                          {discount.quantity}개 이상:{" "}
                          {formatDiscountRate(discount.rate)} 할인
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full px-3 py-1 rounded ${
                      remainingStock > 0
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={remainingStock <= 0}
                  >
                    {remainingStock > 0 ? "장바구니에 추가" : "품절"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">장바구니 내역</h2>

          <div className="space-y-2">
            {cart.map((item) => {
              const appliedDiscount = getAppliedDiscount(item);
              return (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center bg-white p-3 rounded shadow"
                >
                  <div>
                    <span className="font-semibold">{item.product.name}</span>
                    <br />
                    <span className="text-sm text-gray-600">
                      {item.product.price}원 x {item.quantity}
                      {appliedDiscount > 0 && (
                        <span className="text-green-600 ml-1">
                          {formatDiscountRate(appliedDiscount)} 할인 적용
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="bg-gray-300 text-gray-800 px-2 py-1 rounded mr-1 hover:bg-gray-400"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">쿠폰 적용</h2>
            <select
              onChange={(e) => applyCoupon(coupons[parseInt(e.target.value)])}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">쿠폰 선택</option>
              {coupons.map((coupon, index) => (
                <option key={coupon.code} value={index}>
                  {coupon.name} -{" "}
                  {coupon.discountType === "amount"
                    ? `${coupon.discountValue}원`
                    : `${coupon.discountValue}%`}
                </option>
              ))}
            </select>
            {selectedCoupon && (
              <p className="text-green-600">
                적용된 쿠폰: {selectedCoupon.name}(
                {selectedCoupon.discountType === "amount"
                  ? `${selectedCoupon.discountValue}원`
                  : `${selectedCoupon.discountValue}%`}{" "}
                할인)
              </p>
            )}
          </div>

          <div className="mt-6 bg-white p-4 rounded shadow">
            <h2 className="text-2xl font-semibold mb-2">주문 요약</h2>
            <div className="space-y-1">
              <p>상품 금액: {formatPrice(totalBeforeDiscount)}</p>
              <p className="text-green-600">
                할인 금액: {formatPrice(totalDiscount)}
              </p>
              <p className="text-xl font-bold">
                최종 결제 금액: {formatPrice(totalAfterDiscount)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
