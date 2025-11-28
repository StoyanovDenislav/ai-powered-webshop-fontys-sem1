"use client";

import type { SVGProps } from "react";
import Link from "next/link";
import { useState, useEffect } from "react";

type SearchAndFiltersProps = {
  onSearch?: (query: string) => void;
  onFilterByGenre?: (genres: string[]) => void;
  availableGenres?: string[];
};

interface BookSuggestion {
  id: number;
  title: string;
  author: string;
  price: number;
}

export function SearchAndFilters({
  onSearch,
  onFilterByGenre,
  availableGenres = [],
}: SearchAndFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [recommendations, setRecommendations] = useState<BookSuggestion[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
    setShowSuggestions(false);
  };

  const handleSearchInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Fetch suggestions if query is not empty
    if (query.trim().length > 1) {
      setLoadingSuggestions(true);
      setShowSuggestions(true);
      try {
        const response = await fetch(
          `http://localhost:6001/books/search?q=${encodeURIComponent(query)}`
        );
        if (response.ok) {
          const data = await response.json();
          const books = data.books || [];
          // Limit to 5 suggestions
          setSuggestions(books.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      } finally {
        setLoadingSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }

    // Real-time search
    if (onSearch) {
      onSearch(query);
    }
  };

  const handleSuggestionClick = (book: BookSuggestion) => {
    setSearchQuery(book.title);
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(book.title);
    }
  };

  const handleGenreFilter = (genre: string) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    if (onFilterByGenre) {
      onFilterByGenre(newGenres);
    }
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch("http://localhost:6001/books");
      if (response.ok) {
        const data = await response.json();
        const books = data.books || [];
        // Get 5 random books as recommendations
        const shuffled = books.sort(() => 0.5 - Math.random());
        setRecommendations(shuffled.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  };

  const handleSearchFocus = () => {
    if (searchQuery.trim().length === 0) {
      setShowSuggestions(true);
      if (recommendations.length === 0) {
        fetchRecommendations();
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div className="flex-1 relative">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 rounded-2xl border border-[#eadccc] bg-white/70 px-4 py-3 focus-within:border-[#c28a5c]"
        >
          <IconSearch className="h-5 w-5 text-[#c59060]" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchInput}
            onFocus={handleSearchFocus}
            onBlur={() => {
              // Delay to allow click on suggestion
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            placeholder="Search by title, author, or description..."
            className="w-full bg-transparent text-sm text-[#5d4c40] placeholder:text-[#b5a392] focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSuggestions([]);
                setShowSuggestions(false);
                if (onSearch) onSearch("");
              }}
              className="text-[#b5a392] hover:text-[#5d4c40]"
            >
              ✕
            </button>
          )}
        </form>

        {showSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-[#eadcca] shadow-lg z-50 max-h-96 overflow-y-auto animate-slide-up">
            {loadingSuggestions ? (
              <div className="p-4 text-center text-sm text-[#7a6455]">
                Loading suggestions...
              </div>
            ) : searchQuery.trim().length === 0 ? (
              <>
                <div className="p-4 border-b border-[#eadcca]">
                  <h3 className="text-sm font-semibold text-[#342117]">
                    Recommended for you
                  </h3>
                </div>
                <div className="p-2">
                  {recommendations.map((book) => (
                    <Link
                      key={book.id}
                      href={`/${book.id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f5ede4] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#342117]">
                          {book.title}
                        </p>
                        <p className="text-xs text-[#7a6455]">{book.author}</p>
                      </div>
                      <p className="text-sm font-semibold text-[#342117]">
                        €{Number(book.price).toFixed(2)}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            ) : suggestions.length === 0 ? (
              <div className="p-4 text-center text-sm text-[#7a6455]">
                No suggestions found
              </div>
            ) : (
              <div className="p-2">
                {suggestions.map((book) => (
                  <Link
                    key={book.id}
                    href={`/${book.id}`}
                    onClick={() => handleSuggestionClick(book)}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f5ede4] transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#342117]">
                        {book.title}
                      </p>
                      <p className="text-xs text-[#7a6455]">{book.author}</p>
                    </div>
                    <p className="text-sm font-semibold text-[#342117]">
                      €{Number(book.price).toFixed(2)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex gap-3">
        <div className="relative flex-1">
          <button
            onClick={toggleFilters}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border border-[#decfbe] bg-white px-4 py-3 text-sm font-medium text-[#4c3627] transition hover:bg-[#f6ece2]"
          >
            <IconMenu className="h-4 w-4" />
            Filters
            {selectedGenres.length > 0 && (
              <span className="ml-1 rounded-full bg-[#b07b50] px-2 py-0.5 text-xs text-white">
                {selectedGenres.length}
              </span>
            )}
            <svg
              className={`w-4 h-4 transition-transform ${
                showFilters ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#eadcca] shadow-lg z-50 max-h-96 overflow-y-auto animate-slide-up">
              <div className="p-4 border-b border-[#eadcca]">
                <h3 className="font-semibold text-[#342117]">
                  Filter by Genre
                </h3>
                {selectedGenres.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedGenres([]);
                      if (onFilterByGenre) {
                        onFilterByGenre([]);
                      }
                    }}
                    className="mt-2 text-xs text-[#b07b50] hover:text-[#8a5c40]"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
              <div className="p-2">
                {availableGenres.length === 0 ? (
                  <p className="text-sm text-[#7a6455] text-center py-4">
                    No genres available
                  </p>
                ) : (
                  <div className="space-y-1">
                    {availableGenres.map((genre) => (
                      <label
                        key={genre}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:bg-[#f5ede4]/50 hover:scale-[1.02] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedGenres.includes(genre)}
                          onChange={() => handleGenreFilter(genre)}
                          className="w-4 h-4 rounded border-[#dacbbd] text-[#b07b50] focus:ring-[#c28a5c]"
                        />
                        <span
                          className={
                            selectedGenres.includes(genre)
                              ? "font-medium text-[#342117]"
                              : "text-[#6f5a4d]"
                          }
                        >
                          {genre}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function IconSearch(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  );
}

function IconMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
}
