"use client";

import type { SVGProps } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

type HeaderWithAuthProps = {
  navItems: string[];
};

interface Order {
  id: number;
  status: string;
  subtotal: string;
  total: string;
  placed_at: string;
}

export function HeaderWithAuth({ navItems }: HeaderWithAuthProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const fetchOrders = async () => {
    if (!isAuthenticated) return;

    setLoadingOrders(true);
    try {
      const response = await fetch("http://localhost:6001/orders", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (showOrderHistory && orders.length === 0) {
      fetchOrders();
    }
  }, [showOrderHistory]);

  const toggleOrderHistory = () => {
    setShowOrderHistory(!showOrderHistory);
  };

  return (
    <header className="space-y-6 border-b border-[#efe4d8] pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LogoBadge />
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#b3a28f]">
              Book Markets
            </p>
            <p className="text-xl font-semibold text-[#3d2618]">
              A curated shelf for curious minds
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                href="/cart"
                className="flex items-center gap-2 rounded-full border border-[#dacbbd] bg-white/60 px-4 py-2 text-sm font-medium text-[#4e3a2b] transition hover:bg-[#f2e6da]"
              >
                <IconCart className="h-4 w-4 text-[#b07b50]" />
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </Link>
              <div className="relative">
                <button
                  onClick={toggleOrderHistory}
                  className="flex items-center gap-2 rounded-full border border-[#dacbbd] bg-white/60 px-4 py-2 text-sm font-medium text-[#4e3a2b] transition-all duration-300 hover:bg-[#f2e6da] hover:scale-105 hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-[#342117] flex items-center justify-center text-white font-semibold">
                    {user?.username.charAt(0).toUpperCase()}
                  </div>
                  <span>{user?.username}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      showOrderHistory ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {showOrderHistory && (
                  <div
                    className="absolute right-0 mt-2 w-96 bg-white rounded-2xl border border-[#eadcca] shadow-lg z-50 flex flex-col animate-slide-up"
                    style={{ maxHeight: "32rem" }}
                  >
                    <div className="p-4 border-b border-[#eadcca]">
                      <h3 className="font-semibold text-[#342117]">
                        Order History
                      </h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                      {loadingOrders ? (
                        <p className="text-sm text-[#7a6455] text-center py-4">
                          Loading orders...
                        </p>
                      ) : orders.length === 0 ? (
                        <p className="text-sm text-[#7a6455] text-center py-4">
                          No orders yet
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {orders.map((order) => (
                            <Link
                              key={order.id}
                              href={`/orders/${order.id}`}
                              className="block p-4 border border-[#eadcca]/60 rounded-lg hover:bg-[#f5ede4]/30 hover:border-[#b07b50]/40 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                            >
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="text-sm font-semibold text-[#342117]">
                                    Order #{order.id}
                                  </p>
                                  <p className="text-xs text-[#7a6455] mt-1">
                                    {new Date(
                                      order.placed_at
                                    ).toLocaleDateString("en-US", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                </div>
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    order.status === "Paid"
                                      ? "bg-green-100 text-green-700"
                                      : order.status === "Pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-[#342117]">
                                Total: €{Number(order.total).toFixed(2)}
                              </p>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-[#eadcca] bg-white rounded-b-2xl">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 bg-[#342117] text-white rounded-lg hover:bg-[#4a2f1f] transition text-sm font-medium"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                href="/login"
                className="rounded-full border border-[#dacbbd] bg-white/60 px-4 py-2 text-sm font-medium text-[#4e3a2b] transition hover:bg-[#f2e6da]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#342117] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4a2f1f]"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
      <nav className="flex flex-wrap gap-3 text-sm font-medium text-[#6f5a4d]">
        {navItems.map((item) => {
          if (item.toLowerCase() === "about") {
            return (
              <Link
                key={item}
                href="/about"
                className="rounded-full border border-transparent bg-[#f5ede4] px-4 py-2 transition hover:border-[#d6c6b8] hover:bg-white hover:text-[#3d2618]"
              >
                {item}
              </Link>
            );
          }
          if (item.toLowerCase() === "home") {
            return (
              <Link
                key={item}
                href="/"
                className="rounded-full border border-transparent bg-[#f5ede4] px-4 py-2 transition hover:border-[#d6c6b8] hover:bg-white hover:text-[#3d2618]"
              >
                {item}
              </Link>
            );
          }
          return (
            <button
              key={item}
              className="rounded-full border border-transparent bg-[#f5ede4] px-4 py-2 transition hover:border-[#d6c6b8] hover:bg-white hover:text-[#3d2618]"
            >
              {item}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

function LogoBadge() {
  return (
    <Link href="/">
      <div className="flex items-center gap-3 rounded-2xl border border-[#ecd7c7] bg-white/80 px-4 py-2 shadow-[0_8px_22px_rgba(91,52,24,0.08)] cursor-pointer hover:bg-white hover:shadow-[0_12px_30px_rgba(91,52,24,0.15)] hover:scale-105 transition-all duration-300">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f6dfcc]">
          <BookIcon className="h-6 w-8 text-[#5c2f18]" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm uppercase tracking-[0.55em] text-[#b18a6d]">
            book
          </span>
          <span className="text-2xl font-semibold text-[#402315]">Market</span>
        </div>
      </div>
    </Link>
  );
}

function BookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 20" fill="none" {...props}>
      <path
        d="M3 4.5c0-1 1-1.8 2.2-1.6l8.3 1.5a4 4 0 0 1 3.4 3.9v8.3a1 1 0 0 1-1.3.95l-9.1-2A3 3 0 0 0 3 16Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M29 4.5c0-1-1-1.8-2.2-1.6l-8.3 1.5A4 4 0 0 0 15 8.4v8.3a1 1 0 0 0 1.3.95l9.1-2A3 3 0 0 1 29 16Z"
        fill="currentColor"
      />
      <path
        d="M15.5 5.5 16 16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
      <path
        d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.5a1 1 0 0 0 1-.8L20 7H6.1"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
