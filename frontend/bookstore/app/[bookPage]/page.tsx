import Image from "next/image";
import Link from "next/link";
import { Header } from "../components/Header";
import headerData from "../../src/content/header.json";
import footerData from "../../src/content/footer.json";
import { FALLBACK_BOOKS, type Book } from "../../src/data/books";

type DBBook = {
  id: number;
  title: string;
  author: string;
  description: string;
  price: number;
  genres: string[];
  stock_qty: number;
};

async function fetchBookById(id: string): Promise<Book | null> {
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
    };
  } catch (error) {
    console.error("Error fetching book:", error);
    return null;
  }
}

export default async function BookPage({ params }: { params: any }) {
  const resolvedParams = await params;
  const bookId = resolvedParams.bookPage;
  const book = await fetchBookById(bookId);

  if (!book) {
    return (
      <main className="min-h-screen px-4 py-12 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white/90 p-8">
          <Header navItems={headerData.navItems} />
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
        <Header
          navItems={headerData.navItems}
        
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
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-semibold text-[#3d2618]">
                  {book.price}
                </span>
                {book.badge ? (
                  <span className="ml-3 rounded-full bg-[#3d2618]/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                    {book.badge}
                  </span>
                ) : null}
              </div>

              <div className="flex gap-3">
                <Link
                  href="/"
                  className="rounded-full border border-[#dfcdbb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6a4e33]"
                >
                  Back
                </Link>
                <button className="rounded-full bg-[#8a5c40] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-white">
                  Buy
                </button>
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
