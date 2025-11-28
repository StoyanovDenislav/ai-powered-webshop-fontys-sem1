"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HeaderWithAuth } from "../components/HeaderWithAuth";
import { OrderConfirmation } from "../components/OrderConfirmation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import headerData from "../../src/content/header.json";

export default function CartPage() {
  const { navItems } = headerData;
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    isLoading: cartLoading,
  } = useCart();

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    router.push("/login");
    return null;
  }

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    city: "",
    zipCode: "",
  });

  const [showPaymentForm, setShowPaymentForm] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    items: any[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  } | null>(null);

  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const tax = subtotal * 0.1;
  const shipping = cart.length > 0 ? 5.99 : 0;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    await updateQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = async (id: number) => {
    await removeFromCart(id);
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      alert("Please login to complete your order");
      router.push("/login");
      return;
    }

    setIsProcessing(true);
    try {
      // Store current cart items and totals before they're cleared
      const orderItems = cart.map((item) => ({
        book_id: item.book_id,
        title: item.title,
        author: item.author,
        quantity: item.quantity,
        price: item.price,
      }));

      const orderSummary = {
        items: orderItems,
        subtotal,
        tax,
        shipping,
        total,
      };

      const orderResponse = await fetch("http://localhost:6001/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies with request
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        alert(error.error || "Failed to create order");
        return;
      }

      const orderData = await orderResponse.json();
      const createdOrderId = orderData.orderId;
      setOrderId(createdOrderId);

      const paymentResponse = await fetch("http://localhost:6001/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Send cookies with request
        body: JSON.stringify({
          orderId: createdOrderId,
          provider: "simulated",
        }),
      });

      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        alert(error.error || "Payment failed");
        return;
      }

      // Set the completed order details
      setCompletedOrder(orderSummary);

      // Refresh cart to reflect it's been cleared during order creation
      await refreshCart();

      setShowPaymentForm(false);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="cards-shadow mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-4xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <HeaderWithAuth navItems={navItems} />

        <section>
          <h1 className="text-3xl font-semibold text-[#342117] uppercase tracking-[0.2em] text-center mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-[#342117] mb-4">
                Your Order
              </h2>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#7a6455] mb-4">Your cart is empty</p>
                  <Link href="/" className="text-[#8a5c40] hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 border border-[#eadcca]/60 rounded-lg bg-white relative"
                    >
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-[#7a6455] hover:text-[#342117] hover:bg-[#eadcca]/30 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        ✕
                      </button>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#342117]">
                          {item.title}
                        </h3>
                        <p className="text-sm text-[#7a6455]">{item.author}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            className="w-6 h-6 flex items-center justify-center border border-[#eadcca]/60 rounded hover:bg-[#eadcca]/30"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-sm text-[#7a6455]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            className="w-6 h-6 flex items-center justify-center border border-[#eadcca]/60 rounded hover:bg-[#eadcca]/30"
                            disabled={item.quantity >= item.stock_qty}
                          >
                            +
                          </button>
                          <span className="text-xs text-[#7a6455] ml-2">
                            ({item.stock_qty} available)
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#342117]">
                          €{(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-[#7a6455]">
                          €{Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-6 p-4 border border-[#eadcca]/60 rounded-lg bg-white space-y-2">
                  <div className="flex justify-between text-[#7a6455]">
                    <span>Subtotal:</span>
                    <span>€{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#7a6455]">
                    <span>Tax (10%):</span>
                    <span>€{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#7a6455]">
                    <span>Shipping:</span>
                    <span>€{shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-semibold text-[#342117] pt-2 border-t border-[#eadcca]/60">
                    <span>Total:</span>
                    <span>€{total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="lg:col-span-1">
                {showPaymentForm ? (
                  <>
                    <h2 className="text-xl font-semibold text-[#342117] mb-4">
                      Payment Details
                    </h2>
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handlePayment();
                      }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-[#342117] mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          name="cardNumber"
                          value={paymentDetails.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#342117] mb-1">
                          Card Holder Name
                        </label>
                        <input
                          type="text"
                          name="cardHolder"
                          value={paymentDetails.cardHolder}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-2 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#342117] mb-1">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            name="expiryDate"
                            value={paymentDetails.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#342117] mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            name="cvv"
                            value={paymentDetails.cvv}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="w-full px-4 py-2 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#342117] mb-1">
                          Billing Address
                        </label>
                        <input
                          type="text"
                          name="billingAddress"
                          value={paymentDetails.billingAddress}
                          onChange={handleInputChange}
                          placeholder="123 Main Street"
                          className="w-full px-4 py-2 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#342117] mb-1">
                            City
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={paymentDetails.city}
                            onChange={handleInputChange}
                            placeholder="New York"
                            className="w-full px-4 py-2 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#342117] mb-1">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="zipCode"
                            value={paymentDetails.zipCode}
                            onChange={handleInputChange}
                            placeholder="10001"
                            className="w-full px-4 py-2 border border-[#eadcca]/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#342117]/20"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full mt-6 px-6 py-3 bg-[#342117] text-white font-semibold rounded-lg hover:bg-[#4a2f1f] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isProcessing
                          ? "Processing..."
                          : `Pay €${total.toFixed(2)}`}
                      </button>
                    </form>
                  </>
                ) : null}
              </div>
            )}

            {!showPaymentForm && orderId && completedOrder && (
              <div className="lg:col-span-3">
                <OrderConfirmation
                  orderId={orderId}
                  items={completedOrder.items}
                  subtotal={completedOrder.subtotal}
                  tax={completedOrder.tax}
                  shipping={completedOrder.shipping}
                  total={completedOrder.total}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
