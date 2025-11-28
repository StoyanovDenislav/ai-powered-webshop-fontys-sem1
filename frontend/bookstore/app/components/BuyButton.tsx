"use client";

import { useCart } from "../context/CartContext";
import { useState } from "react";
import Link from "next/link";

interface BuyButtonProps {
  bookId: number;
}

export function BuyButton({ bookId }: BuyButtonProps) {
  const { addToCart, isLoading } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddToCart = async () => {
    await addToCart(bookId);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  if (showSuccess) {
    return (
      <Link
        href="/cart"
        className="rounded-full bg-green-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white"
      >
        View Cart
      </Link>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      className="rounded-full bg-[#8a5c40] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white hover:bg-[#6a4430] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </button>
  );
}
