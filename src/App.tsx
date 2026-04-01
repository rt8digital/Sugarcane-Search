import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AlertTriangle, Clock, Trash2, BookOpen, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { BookFilter } from './components/BookFilter';
import { PdfViewer } from './components/PdfViewer';
import { DonateCTA } from './components/DonateCTA';
import { useSearch } from './hooks/useSearch';
import { useLayout } from './contexts/LayoutContext';
import { BOOKS } from './data/books';
import { SearchResult } from './types';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { SkeletonCard } from './components/ui/skeleton';

/**
 * Main App Component
 * 
 * Primary search interface for SALT - South African Lineage Tracer.
 * Handles search input, results display, and PDF viewing.
 */
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || '';
  const sharedResultParam = params.get('result');

  const {
    results,
    isSearching,
    error,
    performSearch,
    history,
    clearHistory,
    totalIndexed,
    searchMode,
    toggleSearchMode,
    ocrProgress,
  } = useSearch();

  const { setIsPdfViewerOpen } = useLayout();
  const [query, setQuery] = useState(initialQuery);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [viewer, setViewer] = useState<SearchResult | null>(null);

  // Sync PDF viewer state with layout context
  useEffect(() => {
    setIsPdfViewerOpen(!!viewer);
    return () => setIsPdfViewerOpen(false);
  }, [viewer, setIsPdfViewerOpen]);

  // Handle shared result from URL
  useEffect(() => {
    if (sharedResultParam) {
      try {
        JSON.parse(sharedResultParam);
      } catch (e) {
        console.error('Failed to parse shared result:', e);
      }
    }
  }, [sharedResultParam]);

  // Perform search on initial load if query exists
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length >= 2) {
      performSearch(initialQuery, searchMode);
    }
  }, [initialQuery, performSearch, searchMode]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim().length >= 2) {
      navigate(`/?q=${encodeURIComponent(newQuery.trim())}`);
      performSearch(newQuery, searchMode);
    } else if (newQuery.trim().length === 0) {
      navigate('/');
    }
  };

  // Filter results by selected books
  const filteredResults = useMemo(() => {
    if (selectedBooks.length === 0) return results;
    return results.filter((r) => selectedBooks.includes(r.bookId));
  }, [results, selectedBooks]);

  // Group results by book and page
  const groupedResults = useMemo(() => {
    const groups: {
      bookId: string;
      bookTitle: string;
      bookYear: string;
      pages: { page: number; results: SearchResult[] }[];
    }[] = [];

    filteredResults.forEach((res) => {
      let bookGroup = groups.find((g) => g.bookId === res.bookId);
      if (!bookGroup) {
        bookGroup = {
          bookId: res.bookId,
          bookTitle: res.bookTitle,
          bookYear: res.bookYear,
          pages: [],
        };
        groups.push(bookGroup);
      }

      let pageGroup = bookGroup.pages.find((p) => p.page === res.page);
      if (!pageGroup) {
        pageGroup = { page: res.page, results: [] };
        bookGroup.pages.push(pageGroup);
      }
      pageGroup.results.push(res);
    });

    return groups.sort((a, b) => Number(a.bookYear) - Number(b.bookYear));
  }, [filteredResults]);

  // Display states
  const showWelcome = query.trim().length < 2 && !isSearching;
  const showInitialLoading =
    isSearching && results.length === 0 && query.trim().length >= 2;
  const resultCount = filteredResults.length;
  const showEmpty =
    !isSearching && query.trim().length >= 2 && results.length === 0;

  return (
    <div className="w-full flex-1 flex flex-col items-center pb-16 px-6 md:px-8 max-w-6xl mx-auto">
      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full mb-10"
        >
          <Alert variant="destructive">
            <AlertTriangle
              className="shrink-0"
              size={24}
              strokeWidth={1.5}
            />
            <div>
              <AlertDescription className="font-semibold">
                {error}
              </AlertDescription>
            </div>
          </Alert>
        </motion.div>
      )}

      {/* Main Content */}
      {!showInitialLoading && (
        <div
          className={`w-full flex flex-col items-center flex-1 ${
            showWelcome ? 'min-h-[60vh] justify-center py-12' : 'space-y-12 py-12'
          }`}
        >
          {/* Welcome Hero */}
          {showWelcome && (
            <motion.div
              className="text-center space-y-4 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight font-display">
                Trace your{' '}
                <span className="italic-accent bg-gradient-to-r from-primary via-foreground to-accent bg-clip-text text-transparent">
                  heritage
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed font-lora">
                Search{' '}
                <span className="text-foreground font-bold border-b-2 border-primary/30">
                  {totalIndexed.toLocaleString()} pages
                </span>{' '}
                of archival records
              </p>
            </motion.div>
          )}

          {/* Search Section */}
          <div className="w-full space-y-8 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <SearchBar
                isSearching={isSearching}
                onSearch={handleSearch}
                initialValue={query}
                searchMode={searchMode}
                onToggleMode={toggleSearchMode}
                ocrProgress={ocrProgress}
              />
            </motion.div>

            {!showWelcome &&
              results.length > 0 &&
              searchMode === 'index' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <BookFilter
                    books={BOOKS}
                    selectedIds={selectedBooks}
                    onToggle={(id) => {
                      setSelectedBooks((prev) =>
                        prev.includes(id) ? [] : [id]
                      );
                    }}
                  />
                </motion.div>
              )}

            {query.trim().length >= 2 &&
              !isSearching &&
              results.length > 0 && (
                <motion.p
                  className="px-5 py-2.5 bg-muted border border-border rounded-md text-[10px] font-bold text-primary uppercase tracking-widest"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {resultCount.toLocaleString()} matches found
                </motion.p>
              )}
          </div>

          {/* Welcome Content */}
          {showWelcome && (
            <div className="w-full mt-16 space-y-16">
              {history.length > 0 && (
                <motion.div
                  className="w-full flex flex-col items-center space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                    <Clock size={14} strokeWidth={1.5} />
                    <span>Recent Searches</span>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={clearHistory}
                      className="ml-2 h-8 w-8 hover:bg-accent/10 hover:text-accent"
                    >
                      <Trash2 size={12} strokeWidth={1.5} />
                    </Button>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 max-w-xl">
                    {history.slice(0, 5).map((term, i) => (
                      <motion.button
                        key={term}
                        className="px-6 py-3 bg-card text-muted-foreground text-xs font-semibold rounded-md hover:bg-primary/5 hover:text-primary transition-all duration-200 border border-border active:scale-95 shadow-sm"
                        onClick={() => handleSearch(term)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.4 }}
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              <motion.div
                className="pt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <DonateCTA />
              </motion.div>
            </div>
          )}

          {/* Results Feed */}
          {!showWelcome && results.length > 0 && (
            <motion.div
              className="w-full space-y-12 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {groupedResults.map((bookGroup, bookIndex) => (
                <motion.div
                  key={bookGroup.bookId}
                  className="space-y-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: bookIndex * 0.1, duration: 0.5 }}
                >
                  {/* Book Header */}
                  <div className="flex items-center gap-5 py-8 border-b-2 border-primary/10">
                    <div className="p-4 bg-primary/5 rounded-md text-primary shrink-0 border border-primary/10">
                      <BookOpen size={24} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-foreground font-display">
                        {bookGroup.bookTitle}
                      </span>
                      <span className="text-[9px] font-bold text-primary uppercase tracking-widest">
                        Edition {bookGroup.bookYear}
                      </span>
                    </div>
                  </div>

                  {bookGroup.pages.map((pageGroup) => (
                    <div key={pageGroup.page} className="space-y-8">
                      <div className="flex items-center justify-between py-4 px-6 bg-card border border-border rounded-md shadow-sm">
                        <span className="font-bold text-accent uppercase tracking-widest text-[9px]">
                          Page {pageGroup.page}
                        </span>
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">
                          {pageGroup.results.length} records
                        </span>
                      </div>

                      <div className="grid gap-6">
                        {pageGroup.results.map((result, idx) => (
                          <ResultCard
                            key={`${result.bookId}-${result.page}-${idx}`}
                            result={result}
                            index={idx}
                            onClick={setViewer}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}

              <motion.div
                className="pt-12 pb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <DonateCTA />
              </motion.div>
            </motion.div>
          )}

          {/* Loading Skeletons */}
          {isSearching && results.length === 0 && (
            <div className="w-full space-y-6 mt-12">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {/* No Results */}
          {showEmpty && (
            <motion.div
              className="mt-16 mb-12 mx-auto w-full p-12 bg-card border border-border rounded-lg shadow-lg text-center space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 bg-accent/5 w-fit mx-auto rounded-md">
                <Search
                  size={48}
                  className="text-accent opacity-30"
                  strokeWidth={1.5}
                />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-foreground font-display">
                  No matches found
                </h3>
                <p className="text-base text-muted-foreground max-w-sm mx-auto font-lora">
                  No records found for{' '}
                  <span className="text-primary font-semibold italic">
                    "{query}"
                  </span>
                </p>
              </div>
              <div className="pt-6">
                <DonateCTA />
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* PDF Viewer Modal */}
      {viewer && <PdfViewer result={viewer} onClose={() => setViewer(null)} />}
    </div>
  );
}
