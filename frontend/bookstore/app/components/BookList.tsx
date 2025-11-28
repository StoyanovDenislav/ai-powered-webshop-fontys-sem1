"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Book } from "../../src/data/books";

type BookListProps = {
  initialBooks: Book[];
  genreFilters: string[];
};

export function BookList({ initialBooks, genreFilters }: BookListProps) {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenreClick = async (genre: string) => {
    if (selectedGenre === genre) {
      // Deselect - show all books
      setSelectedGenre(null);
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:6001/books");
        const data = await response.json();
        const dbBooks = data.books || [];
        const transformedBooks = dbBooks.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          price: `€${Number(book.price).toFixed(2)}`,
          genre: book.genres?.[0] || "General",
          cover:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=420&q=80",
          description: book.description,
        }));
        setBooks(transformedBooks);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // Select genre - filter books
      setSelectedGenre(genre);
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:6001/books/filter?genre=${encodeURIComponent(
            genre
          )}`
        );
        const data = await response.json();
        const dbBooks = data.books || [];
        const transformedBooks = dbBooks.map((book: any) => ({
          id: book.id,
          title: book.title,
          author: book.author,
          price: `€${Number(book.price).toFixed(2)}`,
          genre: book.genres?.[0] || "General",
          cover:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=420&q=80",
          description: book.description,
        }));
        setBooks(transformedBooks);
      } catch (error) {
        console.error("Error fetching filtered books:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a49081]">
        {genreFilters.map((genre) => (
          <button
            key={genre}
            onClick={() => handleGenreClick(genre)}
            className={`rounded-full border px-4 py-1 transition ${
              selectedGenre === genre
                ? "border-[#b07b50] bg-[#fff7ee] text-[#6a442c]"
                : "border-[#eadccc] bg-white/60 hover:border-[#cda780] hover:bg-[#fff7ee] hover:text-[#6a442c]"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-[#a49081]">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="col-span-full py-12 text-center text-[#a49081]">
            No books found for this genre.
          </div>
        ) : (
          books.map((book) => <BookCard key={book.id} book={book} />)
        )}
      </div>
    </>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#efe4d8] bg-white/90 p-4 shadow-[0_20px_45px_rgba(49,29,4,0.05)] transition hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(49,29,4,0.08)]">
      <div className="relative overflow-hidden rounded-2xl bg-[#f5ede4]">
        <Image
          src={book.cover}
          alt={`${book.title} cover`}
          width={320}
          height={420}
          className="h-64 w-full object-cover"
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
        <Link
          href={`/${book.id}`}
          className="rounded-full border border-[#dfcdbb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6a4e33] transition hover:border-[#b07b50] hover:text-[#40260f]"
        >
          Open
        </Link>
      </div>
    </article>
  );
}
