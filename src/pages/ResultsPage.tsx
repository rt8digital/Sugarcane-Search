import { useSearchParams, Link } from 'react-router-dom';
import { Search, ArrowLeft, Filter, MoreHorizontal, MapPin, Calendar, User, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { BOOKS } from '../data/books';

export default function ResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  const { results, isSearching, performSearch, searchMode, toggleSearchMode } = useSearch();

  useState(() => {
    if (query) {
      performSearch(query, searchMode);
    }
  });

  const filteredResults = results.filter((r) => 
    selectedBooks.length === 0 || selectedBooks.includes(r.bookId)
  );

  const handleSearch = (newQuery: string) => {
    if (newQuery.trim()) {
      performSearch(newQuery.trim(), searchMode);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <span className="text-white text-3xl font-display font-bold">S</span>
            </div>
            <span className="font-display font-bold text-3xl tracking-tight text-slate-900">SALT</span>
          </Link>

          <div className="flex-1 max-w-2xl relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <input
              type="text"
              defaultValue={query}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch((e.target as HTMLInputElement).value);
                }
              }}
              className="w-full pl-14 pr-6 py-4 bg-slate-100 border-0 rounded-xl focus:bg-white focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-lg"
              placeholder="Search ancestors, surnames, or records..."
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-xl transition-colors ${
              showFilters
                ? 'bg-slate-900 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Filter className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-full md:w-80 shrink-0">
              <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-7 sticky top-28">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-5 text-lg">
                    Search Mode
                  </h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => searchMode !== 'index' && toggleSearchMode()}
                      className={`w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all ${
                        searchMode === 'index'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5" />
                        Index Search
                      </div>
                    </button>
                    <button
                      onClick={() => searchMode !== 'ocr' && toggleSearchMode()}
                      className={`w-full text-left px-5 py-4 rounded-xl text-base font-medium transition-all ${
                        searchMode === 'ocr'
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="h-5 w-5" />
                        Deep OCR
                      </div>
                    </button>
                  </div>
                </div>

                <div className="pt-7 border-t border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-5 text-lg">
                    Archives
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {BOOKS.map((book) => (
                      <label
                        key={book.id}
                        className="flex items-start gap-4 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={selectedBooks.includes(book.id)}
                          onChange={() =>
                            setSelectedBooks((prev) =>
                              prev.includes(book.id)
                                ? prev.filter((id) => id !== book.id)
                                : [...prev, book.id]
                            )
                          }
                          className="w-5 h-5 mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <div className="flex-1">
                          <span className="text-base font-medium text-slate-700 group-hover:text-slate-900 transition-colors block">
                            {book.title}
                          </span>
                          <span className="text-sm text-slate-500">{book.year}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Results List */}
          <div className="flex-1">
            {isSearching ? (
              <div className="space-y-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white border border-slate-200 rounded-2xl p-8 animate-pulse"
                  >
                    <div className="h-5 w-40 bg-slate-200 rounded mb-4" />
                    <div className="h-8 w-3/4 bg-slate-200 rounded mb-5" />
                    <div className="h-5 w-full bg-slate-200 rounded mb-3" />
                    <div className="h-5 w-2/3 bg-slate-200 rounded" />
                  </div>
                ))}
              </div>
            ) : filteredResults.length === 0 ? (
              <div className="text-center py-32 bg-white border border-slate-200 rounded-2xl">
                <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="h-14 w-14 text-slate-400" />
                </div>
                <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">
                  No results found
                </h2>
                <p className="text-xl text-slate-600 mb-10 max-w-lg mx-auto leading-relaxed">
                  We couldn't find any records matching "{query}". Try adjusting your search terms or filters.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors text-lg"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to Search
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-10 flex items-center justify-between">
                  <p className="text-lg text-slate-600">
                    Found <span className="font-bold text-slate-900 text-xl">{filteredResults.length}</span> results for{' '}
                    <span className="font-semibold text-slate-900">"{query}"</span>
                  </p>
                </div>

                <div className="grid gap-5">
                  {filteredResults.map((result, i) => (
                    <motion.div
                      key={`${result.bookId}-${result.page}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-xl hover:border-slate-300 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <div className="flex items-center gap-4 mb-3">
                            <span className="text-sm font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                              {result.bookTitle}
                            </span>
                            <span className="w-2 h-2 bg-slate-300 rounded-full" />
                            <span className="text-base font-medium text-slate-500">
                              Page {result.page}
                            </span>
                            <span className="w-2 h-2 bg-slate-300 rounded-full" />
                            <span className="text-base font-medium text-slate-500">
                              {result.bookYear}
                            </span>
                          </div>
                          <h2 className="text-3xl font-display font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {result.record?.fullName || 'Archival Record'}
                          </h2>
                        </div>
                        <button className="p-3 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-xl transition-colors">
                          <MoreHorizontal className="h-7 w-7" />
                        </button>
                      </div>

                      <p className="text-slate-600 mb-7 text-lg leading-relaxed">
                        {result.record?.profession 
                          ? `Occupation: ${result.record.profession}`
                          : result.snippet}
                      </p>

                      <div className="flex flex-wrap items-center justify-between gap-5 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-8">
                          {result.record?.birthDate && (
                            <div className="flex items-center gap-2.5 text-base text-slate-500">
                              <Calendar className="h-5 w-5" />
                              <span className="font-medium">{result.record.birthDate}</span>
                            </div>
                          )}
                          {result.record?.address && (
                            <div className="flex items-center gap-2.5 text-base text-slate-500">
                              <MapPin className="h-5 w-5" />
                              <span className="font-medium">{result.record.address}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {result.record?.profession && (
                            <span className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-full text-base font-medium">
                              {result.record.profession}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-20 flex items-center justify-center gap-4">
                  <button className="px-8 py-4 border-2 border-slate-200 rounded-xl text-base font-bold hover:bg-white hover:border-slate-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-100">
                    Previous
                  </button>
                  <button className="w-14 h-14 bg-slate-900 text-white rounded-xl text-base font-bold shadow-lg">
                    1
                  </button>
                  <button className="w-14 h-14 hover:bg-white border-2 border-transparent hover:border-slate-200 rounded-xl text-base font-bold transition-all text-slate-600">
                    2
                  </button>
                  <button className="w-14 h-14 hover:bg-white border-2 border-transparent hover:border-slate-200 rounded-xl text-base font-bold transition-all text-slate-600">
                    3
                  </button>
                  <button className="px-8 py-4 border-2 border-slate-200 rounded-xl text-base font-bold hover:bg-white hover:border-slate-300 transition-all text-slate-600">
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
