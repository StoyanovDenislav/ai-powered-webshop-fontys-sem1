import Image from "next/image";
import { Header } from "./components/Header";
import headerData from "../src/content/header.json";
import footerData from "../src/content/footer.json";
import { FALLBACK_BOOKS, type Book } from "../src/data/books";

type FooterData = {
  rights: string;
  links: { label: string; href: string }[];
};

// Book data is shared from `src/data/books`

export default function Home() {
  const books = FALLBACK_BOOKS;
  const { navItems, primaryFilters, genreFilters } = headerData;
  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="cards-shadow mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-4xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <Header navItems={navItems} primaryFilters={primaryFilters} />
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#b6a28f]">
                Trending shelves
              </p>
              <h2 className="text-2xl font-semibold text-[#352013]">
                Autumn arrivals & gilded spines
              </h2>
            </div>
            <button className="text-sm font-medium text-[#8a5c40] hover:text-[#5c3c27]">
              View library →
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#a49081]">
            {genreFilters.map((genre) => (
              <button
                key={genre}
                className="rounded-full border border-[#eadccc] bg-white/60 px-4 py-1 hover:border-[#cda780] hover:bg-[#fff7ee] hover:text-[#6a442c]"
              >
                {genre}
              </button>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
        <Footer footerData={footerData} />
      </div>
    </main>
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
          <p className="text-xs text-[#9a887a] line-clamp-2">{book.description}</p>
        ) : null}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold text-[#3d2618]">
          {book.price}
        </span>
        <button className="rounded-full border border-[#dfcdbb] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#6a4e33] transition hover:border-[#b07b50] hover:text-[#40260f]">
          Open
        </button>
      </div>
    </article>
  );
}

function Footer({ footerData }: { footerData: FooterData }) {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-[#efe4d8] pt-8 text-center text-sm text-[#6a5a4c] sm:flex-row sm:justify-between">
      <p>© {new Date().getFullYear()} {footerData.rights}</p>
      <div className="flex gap-4 text-xs uppercase tracking-[0.4em] text-[#a38773]">
        {footerData.links.map((link) => (
          <a key={link.label} href={link.href}>{link.label}</a>
        ))}
      </div>
    </footer>
  );
}
