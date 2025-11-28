"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { HeaderWithAuth } from "./HeaderWithAuth";
import { SearchAndFilters } from "./SearchAndFilters";
import { BookList } from "./BookList";
import type { Book } from "../../src/data/books";

type HomeContentProps = {
  initialBooks: Book[];
  availableGenres: string[];
  navItems: string[];
};

export function HomeContent({
  initialBooks,
  availableGenres,
  navItems,
}: HomeContentProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGenres, setCurrentGenres] = useState<string[]>([]);
  const [currentSearch, setCurrentSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(10);

  // Calculate pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  // Reset to page 1 when books change
  const updateBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    setCurrentPage(1);
  };

  const transformBooks = (dbBooks: any[]): Book[] => {
    return dbBooks.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      price: `€${Number(book.price).toFixed(2)}`,
      genre: book.genres?.[0] || "General",
      cover:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=420&q=80",
      description: book.description,
    }));
  };

  const fetchFilteredBooks = useCallback(
    async (genres: string[], searchQuery: string) => {
      setIsLoading(true);
      try {
        let url = "http://localhost:6001/books";

        // Fetch all books first, then filter
        if (searchQuery.trim() && genres.length > 0) {
          // Search endpoint with client-side genre filtering
          url = `http://localhost:6001/books/search?q=${encodeURIComponent(
            searchQuery
          )}`;
          const response = await fetch(url);
          const data = await response.json();
          let filteredBooks = data.books || [];

          // Filter by genres client-side (book must have at least one of the selected genres)
          filteredBooks = filteredBooks.filter(
            (book: any) =>
              book.genres && book.genres.some((g: string) => genres.includes(g))
          );

          updateBooks(transformBooks(filteredBooks));
        } else if (searchQuery.trim()) {
          // Only search query
          url = `http://localhost:6001/books/search?q=${encodeURIComponent(
            searchQuery
          )}`;
          const response = await fetch(url);
          const data = await response.json();
          updateBooks(transformBooks(data.books || []));
        } else if (genres.length > 0) {
          // Only genre filters - fetch all books and filter client-side
          const response = await fetch("http://localhost:6001/books");
          const data = await response.json();
          let filteredBooks = data.books || [];

          // Filter by genres (book must have at least one of the selected genres)
          filteredBooks = filteredBooks.filter(
            (book: any) =>
              book.genres && book.genres.some((g: string) => genres.includes(g))
          );

          updateBooks(transformBooks(filteredBooks));
        } else {
          // No filters
          const response = await fetch(url);
          const data = await response.json();
          updateBooks(transformBooks(data.books || []));
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (query: string) => {
      setCurrentSearch(query);
      fetchFilteredBooks(currentGenres, query);
    },
    [currentGenres, fetchFilteredBooks]
  );

  const handleFilterByGenre = useCallback(
    (genres: string[]) => {
      setCurrentGenres(genres);
      fetchFilteredBooks(genres, currentSearch);
    },
    [currentSearch, fetchFilteredBooks]
  );

  return (
    <>
      <HeaderWithAuth navItems={navItems} />
      <SearchAndFilters
        onSearch={handleSearch}
        onFilterByGenre={handleFilterByGenre}
        availableGenres={availableGenres}
      />
      <section className="space-y-6 mt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-[#b6a28f]">
              Trending shelves
            </p>
            <h2 className="text-2xl font-semibold text-[#352013]">
              Autumn arrivals & gilded spines
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#6f5a4d]">
                Show:
              </label>
              <select
                value={booksPerPage}
                onChange={(e) => {
                  setBooksPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#dacbbd] bg-white px-3 py-1.5 text-sm text-[#342117] focus:border-[#b07b50] focus:outline-none focus:ring-1 focus:ring-[#b07b50]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <button className="text-sm font-medium text-[#8a5c40] hover:text-[#5c3c27]">
              View library →
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="py-12 text-center text-[#a49081]">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="py-12 text-center text-[#a49081]">
            No books found matching your criteria.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm text-[#7a6455]">
              <p>
                Showing {indexOfFirstBook + 1} to{" "}
                {Math.min(indexOfLastBook, books.length)} of {books.length}{" "}
                books
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {currentBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-[#dacbbd] bg-white px-4 py-2 text-sm font-medium text-[#342117] transition hover:bg-[#f5ede4] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                              currentPage === page
                                ? "bg-[#342117] text-white"
                                : "border border-[#dacbbd] bg-white text-[#342117] hover:bg-[#f5ede4]"
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 2 ||
                        page === currentPage + 2
                      ) {
                        return (
                          <span
                            key={page}
                            className="px-2 py-2 text-sm text-[#7a6455]"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-[#dacbbd] bg-white px-4 py-2 text-sm font-medium text-[#342117] transition hover:bg-[#f5ede4] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/${book.id}`}>
      <article className="flex flex-col gap-4 rounded-2xl border border-[#efe4d8] bg-white/90 p-4 shadow-[0_20px_45px_rgba(49,29,4,0.05)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_30px_70px_rgba(49,29,4,0.12)] hover:border-[#b07b50]/30 cursor-pointer group">
        <div className="relative overflow-hidden rounded-2xl bg-[#f5ede4]">
          <img
            src={book.cover}
            alt={`${book.title} cover`}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {book.badge ? (
            <span className="absolute left-3 top-3 rounded-full bg-[#3d2618]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              {book.badge}
            </span>
          ) : null}
        </div>
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-[#b7a597]">
            {book.genre}
          </p>
          <h3 className="text-lg font-semibold text-[#342117]">{book.title}</h3>
          <p className="text-sm text-[#7a6455]">{book.author}</p>
          {book.description ? (
            <p className="text-xs text-[#9a887a] line-clamp-2">
              {book.description}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-[#3d2618]">
            {book.price}
          </span>
          <span className="rounded-full border border-[#dfcdbb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6a4e33] transition-all duration-300 group-hover:bg-[#342117] group-hover:border-[#342117] group-hover:text-white group-hover:scale-105">
            Buy
          </span>
        </div>
      </article>
    </Link>
  );
}
