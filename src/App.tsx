import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader, AlertTriangle, Clock, Trash2 } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SearchBar } from './components/SearchBar';
import { ResultCard } from './components/ResultCard';
import { PdfViewer } from './components/PdfViewer';
import { BookFilter } from './components/BookFilter';
import { BOOKS } from './data/books';
import { usePdfIndex } from './hooks/usePdfIndex';
import { useSearch } from './hooks/useSearch';
import { useSearchHistory } from './hooks/useSearchHistory';
import { SearchResult } from './types';

export default function App() {
  const { indexes, loading, error, progress } = usePdfIndex(BOOKS);
  const { query, setQuery, results, isSearching, selectedBooks, setSelectedBooks, resultCount } =
    useSearch(indexes, BOOKS);
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const [viewer, setViewer] = useState<SearchResult | null>(null);

  const totalIndexed = useMemo(() => {
    let count = 0;
    indexes.forEach((idx) => (count += idx.pages.length));
    return count;
  }, [indexes]);

  const loadedBookIds = useMemo(() => [...indexes.keys()], [indexes]);

  const showInitialLoading = loading && indexes.size === 0;
  const showIncrementalLoading = loading && indexes.size > 0;
  
  const showEmpty = query.trim().length >= 2 && results.length === 0 && !isSearching && !showInitialLoading;
  const showWelcome = query.trim().length < 2 && !showInitialLoading;

  // Save search to history when results come in
  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.trim().length >= 2) {
      addToHistory(newQuery);
    }
  };

  const SkeletonCard = () => (
    <div className="skeleton-card">
      <div className="skeleton-shimmer" />
      <div className="skeleton-line skeleton-header" />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-text" />
      <div className="skeleton-line skeleton-text short" />
    </div>
  );

  return (
    <div className="app">
      <Header />

      <main className="main-content">
        {/* Initial Loading state (0 books indexed) */}
        {showInitialLoading && (
          <div className="loading-state">
            <Loader size={24} className="spin" />
            <span>Indexing heritage records… {Math.round(progress * 100)}%</span>
          </div>
        )}

        {/* Index error */}
        {!showInitialLoading && error && (
          <div className="error-banner">
            <AlertTriangle size={18} />
            <div>
              <strong>Service Alert.</strong>
              <br />
              {error}
            </div>
          </div>
        )}

        {/* Search bar & Filters (show as soon as 1 book is ready) */}
        {!showInitialLoading && (
          <>
            <SearchBar
              query={query}
              onChange={handleSearch}
              isSearching={isSearching}
              resultCount={resultCount}
              totalIndexed={totalIndexed}
            />

            <BookFilter
              books={BOOKS}
              selectedBooks={selectedBooks}
              loadedBooks={loadedBookIds}
              onChange={setSelectedBooks}
            />

            {showIncrementalLoading && (
              <div className="incremental-info">
                <Loader size={12} className="spin" />
                <span>Background indexing: {Math.round(progress * 100)}% complete</span>
              </div>
            )}
          </>
        )}

        {/* Welcome / empty hero */}
        {showWelcome && !showInitialLoading && (
          <motion.div
            className="welcome-state"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="welcome-text">
              Explore <strong>{totalIndexed.toLocaleString()} pages</strong> of biographical history.
              Search by name, trade, or family lineage to begin.
            </p>
            {history.length > 0 ? (
              <div className="welcome-history">
                <div className="history-header">
                  <Clock size={14} />
                  <span>Recent searches</span>
                  <button className="history-clear" onClick={clearHistory} title="Clear history">
                    <Trash2 size={12} />
                  </button>
                </div>
                <div className="welcome-examples">
                  {history.slice(0, 5).map((term) => (
                    <button key={term} className="example-chip" onClick={() => handleSearch(term)}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="welcome-examples">
                {['Gandhi', 'Durban attorney', 'cane grower', 'medical', 'Lockhat'].map((ex) => (
                  <button key={ex} className="example-chip" onClick={() => handleSearch(ex)}>
                    {ex}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Results feed & Skeletons */}
        <div className="results-feed" role="list">
          {isSearching && results.length === 0 ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <AnimatePresence mode="popLayout">
              {results.map((r, i) => (
                <ResultCard
                  key={`${r.bookId}-${r.page}-${r.type}-${r.record?.fullName || ''}`}
                  result={r}
                  index={i}
                  onClick={setViewer}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* No results */}
        {showEmpty && (
          <motion.div className="no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p>No matches found for &ldquo;{query}&rdquo; yet.</p>
            <p className="no-results-hint">
              {showIncrementalLoading 
                ? "Searching continues as more volumes are indexed..." 
                : "Try a different name, location, or broader terms."}
            </p>
          </motion.div>
        )}
      </main>

      <Footer />

      {/* PDF Viewer modal */}
      {viewer && (
        <PdfViewer
          pdfPath={viewer.pdfPath}
          bookTitle={viewer.bookTitle}
          initialPage={viewer.page}
          highlights={viewer.matchedTerms}
          onClose={() => setViewer(null)}
        />
      )}
    </div>
  );
}
