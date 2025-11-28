"use client";

import Link from "next/link";

interface OrderItem {
  book_id: number;
  title: string;
  author: string;
  quantity: number;
  price: string;
}

interface OrderConfirmationProps {
  orderId: number;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export function OrderConfirmation({
  orderId,
  items,
  subtotal,
  tax,
  shipping,
  total,
}: OrderConfirmationProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Success Header */}
      <div className="text-center py-8 border-b border-[#eadcca]">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold text-[#342117] mb-2">
          Order Confirmed!
        </h2>
        <p className="text-[#7a6455]">
          Thank you for your purchase. Your order has been successfully placed.
        </p>
      </div>

      {/* Order Details */}
      <div className="bg-[#f5ede4]/30 rounded-2xl p-6 border border-[#eadcca]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#342117]">
            Order Details
          </h3>
          <span className="text-sm text-[#7a6455]">Order #{orderId}</span>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-3 border-b border-[#eadcca]/50 last:border-0"
            >
              <div className="flex-1">
                <Link
                  href={`/${item.book_id}`}
                  className="font-medium text-[#342117] hover:text-[#8a5c40] transition"
                >
                  {item.title}
                </Link>
                <p className="text-sm text-[#7a6455]">{item.author}</p>
                <p className="text-xs text-[#7a6455] mt-1">
                  Quantity: {item.quantity}
                </p>
              </div>
              <div className="text-right ml-4">
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
      </div>

      {/* Order Summary */}
      <div className="bg-white rounded-2xl p-6 border border-[#eadcca]">
        <h3 className="text-lg font-semibold text-[#342117] mb-4">
          Order Summary
        </h3>
        <div className="space-y-2">
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
          <div className="flex justify-between text-xl font-semibold text-[#342117] pt-3 border-t border-[#eadcca]">
            <span>Total Paid:</span>
            <span>€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          What's Next?
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              You will receive a confirmation email with your order details
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Your order will be processed and shipped within 2-3 business days</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              You can track your order status in your{" "}
              <Link href="/" className="underline hover:text-blue-600">
                order history
              </Link>
            </span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/orders/${orderId}`}
          className="flex-1 text-center px-6 py-3 border-2 border-[#342117] text-[#342117] font-semibold rounded-lg hover:bg-[#342117] hover:text-white transition-colors duration-200"
        >
          View Order Details
        </Link>
        <Link
          href="/"
          className="flex-1 text-center px-6 py-3 bg-[#342117] text-white font-semibold rounded-lg hover:bg-[#4a2f1f] transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
