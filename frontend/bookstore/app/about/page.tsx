import { Header } from "../components/Header";
import headerData from "../../src/content/header.json";

export default function AboutPage() {
  const { navItems, primaryFilters } = headerData;
  return (
    <main className="min-h-screen bg-transparent px-4 py-10 sm:px-8 lg:px-10">
      <div className="cards-shadow mx-auto flex w-full max-w-4xl flex-col gap-8 rounded-4xl border border-[#eadcca]/80 bg-white/90 p-6 backdrop-blur-sm sm:p-10">
        <Header navItems={navItems} primaryFilters={primaryFilters} />

        <section className="text-center">
          <h1 className="text-3xl font-semibold text-[#342117] uppercase tracking-[0.2em]">
            ABOUT BookMarket
          </h1>
          <div className="mt-8 space-y-6 text-sm text-[#7a6455] leading-relaxed">
            <p>
              <strong>About Us — BookMarket</strong>
            </p>
            <p>
              Welcome to BookMarket, your trusted online destination for books of every kind.
              We believe that reading should be accessible, enjoyable, and inspiring for everyone. That’s why we created a marketplace where book lovers, students, and curious minds can easily discover the stories and knowledge they’re looking for.
            </p>
            <p>
              At BookMarket, we bring together a diverse collection of books — from best-selling novels and academic texts to rare finds and independent authors. Our goal is simple: to make it easy for you to find the books you love at prices you can afford.
            </p>
            <h2 className="text-lg font-semibold text-[#342117]">Our Mission</h2>
            <p>
              To create a modern, user-friendly marketplace that connects readers with the books they want, while supporting authors, sellers, and the reading community.
            </p>
            <h2 className="text-lg font-semibold text-[#342117]">What We Offer</h2>
            <ul className="list-none space-y-2">
              <li>📚 A wide selection of new and used books</li>
              <li>💰 Affordable prices and transparent listings</li>
              <li>🔍 Smart search tools to help you find exactly what you need</li>
              <li>🚚 Reliable delivery and smooth ordering</li>
              <li>💬 Friendly support for all your questions</li>
            </ul>
            <h2 className="text-lg font-semibold text-[#342117]">Why BookMarket?</h2>
            <p>
              Because we believe books change lives. Whether you’re studying, relaxing, exploring new ideas, or expanding your personal library — BookMarket is here to help you turn the page toward something new.
            </p>
            <p>
              Thank you for being part of our growing community of readers!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
