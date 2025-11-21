import type { SVGProps } from "react";
type HeaderProps = {
  navItems: string[];
  primaryFilters: string[];
};

export function Header({ navItems, primaryFilters }: HeaderProps) {
  return (
    <header className="space-y-6 border-b border-[#efe4d8] pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LogoBadge />
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#b3a28f]">
              Book Market
            </p>
            <p className="text-xl font-semibold text-[#3d2618]">
              A curated shelf for curious minds
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-full border border-[#dacbbd] bg-white/60 px-4 py-2 text-sm font-medium text-[#4e3a2b] transition hover:bg-[#f2e6da]">
          <IconCart className="h-4 w-4 text-[#b07b50]" />
          4 items
        </button>
      </div>
      <nav className="flex flex-wrap gap-3 text-sm font-medium text-[#6f5a4d]">
        {navItems.map((item) => (
          <button
            key={item}
            className="rounded-full border border-transparent bg-[#f5ede4] px-4 py-2 transition hover:border-[#d6c6b8] hover:bg-white hover:text-[#3d2618]"
          >
            {item}
          </button>
        ))}
      </nav>
      <div className="flex flex-col gap-4 lg:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-2xl border border-[#eadccc] bg-white/70 px-4 py-3 focus-within:border-[#c28a5c]">
          <IconSearch className="h-5 w-5 text-[#c59060]" />
          <input
            type="text"
            placeholder="Search by title, feeling, or ritual..."
            className="w-full bg-transparent text-sm text-[#5d4c40] placeholder:text-[#b5a392] focus:outline-none"
          />
        </label>
        <div className="flex gap-3">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#decfbe] bg-white px-4 py-3 text-sm font-medium text-[#4c3627] transition hover:bg-[#f6ece2]">
            <IconMenu className="h-4 w-4" />
            Filters
          </button>
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#decfbe] bg-[#fff8f3] px-4 py-3 text-sm font-medium text-[#7a4f35] transition hover:bg-[#fde8db]">
            New drop
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-medium text-[#6b594c]">
        {primaryFilters.map((filter) => (
          <span
            key={filter}
            className="rounded-full border border-[#eadccc] bg-white/80 px-4 py-1 capitalize shadow-sm"
          >
            {filter}
          </span>
        ))}
      </div>
    </header>
  );
}

function LogoBadge() {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[#ecd7c7] bg-white/80 px-4 py-2 shadow-[0_8px_22px_rgba(91,52,24,0.08)]">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f6dfcc]">
        <BookIcon className="h-6 w-8 text-[#5c2f18]" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm uppercase tracking-[0.55em] text-[#b18a6d]">
          book
        </span>
        <span className="text-2xl font-semibold text-[#402315]">
          Market
        </span>
      </div>
    </div>
  );
}

function BookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 20" fill="none" {...props}>
      <path
        d="M3 4.5c0-1 1-1.8 2.2-1.6l8.3 1.5a4 4 0 0 1 3.4 3.9v8.3a1 1 0 0 1-1.3.95l-9.1-2A3 3 0 0 0 3 16Z"
        fill="currentColor"
        opacity="0.75"
      />
      <path
        d="M29 4.5c0-1-1-1.8-2.2-1.6l-8.3 1.5A4 4 0 0 0 15 8.4v8.3a1 1 0 0 0 1.3.95l9.1-2A3 3 0 0 1 29 16Z"
        fill="currentColor"
      />
      <path
        d="M15.5 5.5 16 16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="11" cy="11" r="7" strokeWidth="1.6" />
      <path d="M20 20L16.65 16.65" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconCart(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <circle cx="9" cy="20" r="1.2" />
      <circle cx="17" cy="20" r="1.2" />
      <path
        d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.5a1 1 0 0 0 1-.8L20 7H6.1"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path
        d="M4 7h16M4 12h10M4 17h7"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

