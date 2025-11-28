import type Image from "next/image";

export type Book = {
  id: number | string;
  title: string;
  author: string;
  price: string;
  genre: string;
  cover: string;
  badge?: string;
  description?: string;
};

export const FALLBACK_BOOKS: Book[] = [
  {
    id: "fallback-1",
    title: "Can't Hurt Me",
    author: "David Goggins",
    price: "€24.50",
    genre: "Memoir",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=420&q=80",
    badge: "Top pick",
  },
  {
    id: "fallback-2",
    title: "The Housemaid",
    author: "Freida McFadden",
    price: "€18.90",
    genre: "Thriller",
    cover:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "fallback-3",
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    price: "€15.40",
    genre: "Classic",
    cover:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=420&q=80",
    badge: "Reissued",
  },
  {
    id: "fallback-4",
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: "€26.00",
    genre: "Fantasy",
    cover:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "fallback-5",
    title: "The Chestnut Man",
    author: "Søren Sveistrup",
    price: "€19.70",
    genre: "Nordic noir",
    cover:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "fallback-6",
    title: "Educated",
    author: "Tara Westover",
    price: "€21.90",
    genre: "Memoir",
    cover:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "fallback-7",
    title: "The Snow Queen",
    author: "Hans Christian Andersen",
    price: "€14.20",
    genre: "Fairytale",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=420&q=80",
  },
  {
    id: "fallback-8",
    title: "Third Reich",
    author: "William L. Shirer",
    price: "€32.00",
    genre: "History",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=420&q=80",
  },
];

export default FALLBACK_BOOKS;
