import Image from "next/image";
import { HomeContent } from "./components/HomeContent";
import headerData from "../src/content/header.json";
import footerData from "../src/content/footer.json";
import { FALLBACK_BOOKS, type Book } from "../src/data/books";

type FooterData = {
  rights: string;
  links: { label: string; href: string }[];
};

type DBBook = {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  genres: string[];
  stock_qty: number;
};

async function fetchBooks(): Promise<Book[]> {
  try {
    const response = await fetch("http://localhost:6001/books", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch books");
    }

    const data = await response.json();
    const dbBooks: DBBook[] = data.books || [];

    // Transform DB books to match the Book type
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
  } catch (error) {
    console.error("Error fetching books:", error);
    return FALLBACK_BOOKS;
  }
}

async function fetchGenres(): Promise<string[]> {
  try {
    const response = await fetch("http://localhost:6001/genres", {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }

    const data = await response.json();
    return data.genres || [];
  } catch (error) {
    console.error("Error fetching genres:", error);
    return headerData.genreFilters;
  }
}

// Book data is fetched from the backend

export default async function Home() {
  const books = await fetchBooks();
  const availableGenres = await fetchGenres();
  const { navItems } = headerData;
  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="cards-shadow mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-4xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <HomeContent
          initialBooks={books}
          availableGenres={availableGenres}
          navItems={navItems}
        />
        <Footer footerData={footerData} />
      </div>
    </main>
  );
}

function Footer({ footerData }: { footerData: FooterData }) {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-[#efe4d8] pt-8 text-center text-sm text-[#6a5a4c] sm:flex-row sm:justify-between">
      <p>
        © {new Date().getFullYear()} {footerData.rights}
      </p>
      <div className="flex gap-4 text-xs uppercase tracking-[0.4em] text-[#a38773]">
        {footerData.links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
