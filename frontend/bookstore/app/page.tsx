import Image from "next/image";
import { Header } from "./components/Header";

type Book = {
  title: string;
  author: string;
  price: string;
  genre: string;
  cover: string;
  badge?: string;
};

const navItems = ["Home", "Story", "Theme", "About"];

const primaryFilters = [
  "Soul/ fiction",
  "Mystery",
  "Memoirs",
  "Fantasy",
  "History",
  "Poetry",
];

const genreFilters = [
  "Action",
  "Literary",
  "Biography",
  "Nature",
  "Hobby",
  "Romance",
  "Essays",
];

const books: Book[] = [
  {
    title: "Can't Hurt Me",
    author: "David Goggins",
    price: "€24.50",
    genre: "Memoir",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=420&q=80",
    badge: "Top pick",
  },
  {
    title: "The Housemaid",
    author: "Freida McFadden",
    price: "€18.90",
    genre: "Thriller",
    cover:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=420&q=80",
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    price: "€15.40",
    genre: "Classic",
    cover:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=420&q=80",
    badge: "Reissued",
  },
  {
    title: "Fourth Wing",
    author: "Rebecca Yarros",
    price: "€26.00",
    genre: "Fantasy",
    cover:
      "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=420&q=80",
  },
  {
    title: "The Chestnut Man",
    author: "Søren Sveistrup",
    price: "€19.70",
    genre: "Nordic noir",
    cover:
      "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=420&q=80",
  },
  {
    title: "Educated",
    author: "Tara Westover",
    price: "€21.90",
    genre: "Memoir",
    cover:
      "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=420&q=80",
  },
  {
    title: "The Snow Queen",
    author: "Hans Christian Andersen",
    price: "€14.20",
    genre: "Fairytale",
    cover:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=420&q=80",
  },
  {
    title: "Third Reich",
    author: "William L. Shirer",
    price: "€32.00",
    genre: "History",
    cover:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=420&q=80",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="cards-shadow mx-auto flex w-full max-w-6xl flex-col gap-10 rounded-[32px] border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
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
              <BookCard key={book.title} book={book} />
            ))}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function BookCard({ book }: { book: Book }) {
  return (
    <article className="flex flex-col gap-4 rounded-[26px] border border-[#efe4d8] bg-white/90 p-4 shadow-[0_20px_45px_rgba(49,29,4,0.05)] transition hover:-translate-y-1.5 hover:shadow-[0_25px_60px_rgba(49,29,4,0.08)]">
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

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-[#efe4d8] pt-8 text-center text-sm text-[#6a5a4c] sm:flex-row sm:justify-between">
      <p>© {new Date().getFullYear()} Book Market. Curated shelves daily.</p>
      <div className="flex gap-4 text-xs uppercase tracking-[0.4em] text-[#a38773]">
        <span>Stories</span>
        <span>Playlists</span>
        <span>Contact</span>
      </div>
    </footer>
  );
}
