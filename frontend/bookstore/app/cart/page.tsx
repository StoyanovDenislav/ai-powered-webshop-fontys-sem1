"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import headerData from "../../src/content/header.json";

interface CartItem {
  id: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  image?: string;
}

export default function CartPage() {
  const { navItems, primaryFilters } = headerData;
  
  // Empty cart - users can add items
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

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

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 5.99;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePayment = () => {
    // Add payment processing logic here
    setShowPaymentForm(false);
    alert("Payment processed successfully!");
  };

  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="cards-shadow mx-auto flex w-full max-w-6xl flex-col gap-8 rounded-4xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <Header navItems={navItems} primaryFilters={primaryFilters} />

        <section>
          <h1 className="text-3xl font-semibold text-[#342117] uppercase tracking-[0.2em] text-center mb-8">
            Shopping Cart
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold text-[#342117] mb-4">Your Order</h2>
              
              {cartItems.length === 0 ? (
                <p className="text-[#7a6455]">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
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
                        <h3 className="font-semibold text-[#342117]">{item.title}</h3>
                        <p className="text-sm text-[#7a6455]">{item.author}</p>
                        <p className="text-sm text-[#7a6455]">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#342117]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-sm text-[#7a6455]">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Order Totals */}
              <div className="mt-6 p-4 border border-[#eadcca]/60 rounded-lg bg-white space-y-2">
                <div className="flex justify-between text-[#7a6455]">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7a6455]">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#7a6455]">
                  <span>Shipping:</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-semibold text-[#342117] pt-2 border-t border-[#eadcca]/60">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold text-[#342117] mb-4">Payment Details</h2>
              
              {showPaymentForm ? (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
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
                  className="w-full mt-6 px-6 py-3 bg-[#342117] text-white font-semibold rounded-lg hover:bg-[#4a2f1f] transition-colors duration-200"
                >
                  Pay ${total.toFixed(2)}
                </button>
              </form>
              ) : (
                <div className="p-6 border border-[#eadcca]/60 rounded-lg bg-green-50 text-center">
                  <p className="text-green-700 font-semibold">Payment Successful!</p>
                  <p className="text-sm text-green-600 mt-2">Thank you for your order.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
