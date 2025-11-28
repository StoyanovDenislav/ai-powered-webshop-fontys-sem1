"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { HeaderWithAuth } from "../components/HeaderWithAuth";
import { SearchAndFilters } from "../components/SearchAndFilters";
import { useCart } from "../context/CartContext";
import headerData from "../../src/content/header.json";
import footerData from "../../src/content/footer.json";

type DBBook = {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  genres: string[];
  stock_qty: number;
};

type BookWithStock = {
  id: number;
  title: string;
  author: string;
  price: string;
  genre: string;
  cover: string;
  description: string;
  stock_qty: number;
  badge?: string;
};

async function fetchBookById(id: string): Promise<BookWithStock | null> {
  try {
    const response = await fetch(`http://localhost:6001/books/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const dbBook: DBBook = data.book;

    if (!dbBook) return null;

    return {
      id: dbBook.id,
      title: dbBook.title,
      author: dbBook.author,
      price: `€${Number(dbBook.price).toFixed(2)}`,
      genre: dbBook.genres?.[0] || "General",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=420&q=80",
      description: dbBook.description,
      stock_qty: dbBook.stock_qty,
    };
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}

export default function BookPage({ params }: { params: any }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [book, setBook] = useState<BookWithStock | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [bookId, setBookId] = useState<string>("");
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  useEffect(() => {
    const loadBook = async () => {
      const resolvedParams = await params;
      const id = resolvedParams.bookPage;
      setBookId(id);
      const fetchedBook = await fetchBookById(id);
      setBook(fetchedBook);
      setLoading(false);
    };
    loadBook();

    // Fetch available genres
    const loadGenres = async () => {
      try {
        const response = await fetch("http://localhost:6001/genres");
        if (response.ok) {
          const data = await response.json();
          setAvailableGenres(data.genres || []);
        }
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    loadGenres();
  }, [params]);

  const handleSearch = (query: string) => {
    // Redirect to home page with search query
    router.push(`/?search=${encodeURIComponent(query)}`);
  };

  const handleFilterByGenre = (genres: string[]) => {
    // Redirect to home page with genre filters
    if (genres.length > 0) {
      router.push(`/?genres=${encodeURIComponent(genres.join(","))}`);
    } else {
      router.push("/");
    }
  };

  const handleAddToCart = async () => {
    if (!book) return;
    await addToCart(Number(book.id), quantity);
  };

  const handleBuyNow = async () => {
    if (!book) return;
    await addToCart(Number(book.id), quantity);
    router.push("/cart");
  };

  const incrementQuantity = () => {
    if (book && quantity < book.stock_qty) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/90 p-8">
          <HeaderWithAuth navItems={headerData.navItems} />
          <div className="py-12 text-center">
            <p className="text-sm text-[#7a6455]">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!book) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/90 p-8">
          <HeaderWithAuth navItems={headerData.navItems} />
          <div className="py-12 text-center">
            <h2 className="text-2xl font-semibold">Book not found</h2>
            <p className="mt-4 text-sm text-[#7a6455]">
              We couldn't find the book you're looking for.
            </p>
            <Link href="/" className="mt-6 inline-block text-sm text-[#8a5c40]">
              Return home →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-3xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <HeaderWithAuth navItems={headerData.navItems} />
        <SearchAndFilters
          onSearch={handleSearch}
          onFilterByGenre={handleFilterByGenre}
          availableGenres={availableGenres}
        />

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-[#f5ede4] p-4">
            <Image
              src={book.cover}
              alt={`${book.title} cover`}
              width={640}
              height={840}
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#b7a597]">
                {book.genre}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#342117]">
                {book.title}
              </h1>
              <p className="mt-1 text-sm text-[#7a6455]">{book.author}</p>

              {book.description ? (
                <p className="mt-4 text-sm text-[#9a887a]">
                  {book.description}
                </p>
              ) : null}

              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm font-medium text-[#342117]">
                  Stock:
                </span>
                <span
                  className={`text-sm font-semibold ${
                    book.stock_qty > 10
                      ? "text-green-600"
                      : book.stock_qty > 0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {book.stock_qty > 0
                    ? `${book.stock_qty} available`
                    : "Out of stock"}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-[#3d2618]">
                  {book.price}
                </span>
                {book.badge ? (
                  <span className="ml-3 rounded-full bg-[#3d2618]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {book.badge}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-[#342117]">
                  Quantity:
                </span>
                <div className="flex items-center gap-2 rounded-lg border border-[#dacbbd] bg-white">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-[#342117] hover:bg-[#f5ede4] disabled:opacity-50 disabled:cursor-not-allowed transition rounded-l-lg"
                  >
                    −
                  </button>
                  <span className="px-4 text-sm font-medium text-[#342117] min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= book.stock_qty}
                    className="px-3 py-2 text-[#342117] hover:bg-[#f5ede4] disabled:opacity-50 disabled:cursor-not-allowed transition rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={book.stock_qty === 0}
                  className="w-full rounded-full border-2 border-[#342117] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#342117] transition hover:bg-[#342117] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={book.stock_qty === 0}
                  className="w-full rounded-full bg-[#342117] px-6 py-3 text-sm font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[#4a2f1f] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy Now
                </button>
                <Link
                  href="/"
                  className="w-full text-center rounded-full border border-[#dfcdbb] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#6a4e33] hover:bg-[#f5ede4] transition"
                >
                  Back
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-[#efe4d8] pt-6 text-center text-sm text-[#6a5a4c] sm:text-left">
          <p>
            © {new Date().getFullYear()} {footerData.rights}
          </p>
        </footer>
      </div>
    </main>
  );
}
