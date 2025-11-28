"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface CartItem {
  id: number;
  book_id: number;
  quantity: number;
  title: string;
  author: string;
  price: string;
  stock_qty: number;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (bookId: number, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const API_URL = "http://localhost:6001";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/cart`, {
        credentials: "include", // Send cookies with request
      });
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || []);
      } else if (response.status === 401) {
        // Token expired or invalid
        setCart([]);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (bookId: number, quantity: number = 1) => {
    if (!isAuthenticated) {
      alert("Please login to add items to cart");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send cookies with request
        body: JSON.stringify({
          bookId,
          quantity,
        }),
      });

      if (response.ok) {
        await refreshCart();
      } else if (response.status === 401) {
        alert("Session expired. Please login again");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: "DELETE",
        credentials: "include", // Send cookies with request
      });

      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error("Error removing from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Send cookies with request
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await refreshCart();
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/cart/clear`, {
        method: "DELETE",
        credentials: "include", // Send cookies with request
      });

      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
