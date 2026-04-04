import React, { useState, useEffect } from 'react';
import { Search, Loader2, Book as BookIcon, ChevronRight, Github, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { usePdfIndex } from './hooks/usePdfIndex';
import { useSearch } from './hooks/useSearch';
import PdfViewer from './components/PdfViewer';
import AboutPage from './components/AboutPage';
import { SearchResult, BookIndex } from './types';
import { cn } from './lib/utils';

const GITHUB_URL = 'https://github.com/rt8digital/Sugarcane-Search';

// Book metadata for display (PDF viewer still needs paths)
export const BOOKS = [
  { id: 'whoswho_1936_pt1', title: "Who's Who 1936-37 (Preface)", year: '1936', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1936_37_pt1_Preface.pdf' },
  { id: 'whoswho_1936_pt2', title: "Who's Who 1936-37 (A-I)", year: '1936', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1936_37_pt2_A_I.pdf' },
  { id: 'whoswho_1936_pt4', title: "Who's Who 1936-37 (O-Z)", year: '1936', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1936_37_pt4_O_Z.pdf' },
  { id: 'whoswho_1936_pt5', title: "Who's Who 1936-37 (A-Z Mixed)", year: '1936', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1936_37_pt5_A_Z_Mixed.pdf' },
  { id: 'whoswho_1940_pt1', title: "Who's Who 1940 (Preface)", year: '1940', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1940_pt1_Preface.pdf' },
  { id: 'whoswho_1940_pt2', title: "Who's Who 1940 (A-K)", year: '1940', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1940_pt2_A_K.pdf' },
  { id: 'whoswho_1940_pt3', title: "Who's Who 1940 (L-Q)", year: '1940', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1940_pt3_L_Q.pdf' },
  { id: 'whoswho_1940_pt4', title: "Who's Who 1940 (R-Z)", year: '1940', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1940_pt4_R_Z.pdf' },
  { id: 'whoswho_1940_pt5', title: "Who's Who 1940 (A-Z)", year: '1940', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1940_pt5_A_Z.pdf' },
  { id: 'whoswho_1940_pt7', title: "Who's Who 1940 (A-Z Part 2)", year: '1940', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1940_pt7_A_Z.pdf' },
  { id: 'whoswho_1940_pt8', title: "Who's Who 1940 (Commercial Directory)", year: '1940', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Whos_Who_1940_pt8_Com_dir.pdf' },
  { id: 'whoswho_1960_pt1', title: "SA Indian Who's Who 1960 (Preface)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_Pt1_preface.pdf' },
  { id: 'whoswho_1960_pt2', title: "SA Indian Who's Who 1960 (A-B)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt2_A_B.pdf' },
  { id: 'whoswho_1960_pt3', title: "SA Indian Who's Who 1960 (C-F)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt3_C_F.pdf' },
  { id: 'whoswho_1960_pt4', title: "SA Indian Who's Who 1960 (G-J)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt4_G_J.pdf' },
  { id: 'whoswho_1960_pt5', title: "SA Indian Who's Who 1960 (K-M)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt5_K_M.pdf' },
  { id: 'whoswho_1960_pt6', title: "SA Indian Who's Who 1960 (N-O)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt6_N_O.pdf' },
  { id: 'whoswho_1960_pt7', title: "SA Indian Who's Who 1960 (P-R)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt7_P_R.pdf' },
  { id: 'whoswho_1960_pt8', title: "SA Indian Who's Who 1960 (S-Z)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt8_S_Z.pdf' },
  { id: 'whoswho_1960_pt9', title: "SA Indian Who's Who 1960 (A-Z Mixed)", year: '1960', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/South_African_Indian_Who_Who_1960_pt9_A_Z_Mixed.pdf' },
  { id: 'whoswho_1971_compressed', title: "SA Indian Who's Who 1971-72 (Full)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_compressed.pdf' },
  { id: 'whoswho_1971_pt4', title: "SA Indian Who's Who 1971-72 (E-G)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt4_E_G.pdf' },
  { id: 'whoswho_1971_pt5', title: "SA Indian Who's Who 1971-72 (H-J)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt5_H_J.pdf' },
  { id: 'whoswho_1971_pt6', title: "SA Indian Who's Who 1971-72 (K-ME)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt6_K_ME.pdf' },
  { id: 'whoswho_1971_pt7', title: "SA Indian Who's Who 1971-72 (MI-O)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt7_MI_O.pdf' },
  { id: 'whoswho_1971_pt8', title: "SA Indian Who's Who 1971-72 (P-R)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt8_P_R.pdf' },
  { id: 'whoswho_1971_pt9', title: "SA Indian Who's Who 1971-72 (S-Z)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt9_S_Z.pdf' },
  { id: 'whoswho_1971_pt10', title: "SA Indian Who's Who 1971-72 (A-Z Mixed)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_ptt_10_A_Z_Mixed.pdf' },
  { id: 'whoswho_1971_pt11', title: "SA Indian Who's Who 1971-72 (A-Z Other)", year: '1971', pdfPath: 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_ptt_11_A_Z_Other.pdf' },
];

export default function App() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  const { indexes, loading: indexing, error, progress } = usePdfIndex();
  const results = useSearch(indexes, debouncedQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
  };

  const totalIndexed = Array.from(indexes.values()).reduce<number>((acc, idx: BookIndex) => acc + idx.totalPages, 0);

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-900 font-sans selection:bg-orange-100 selection:text-orange-900">
      {/* Header / Search Bar */}
      <header className={cn(
        "sticky top-0 z-30 w-full transition-all duration-500 ease-in-out",
        debouncedQuery ? "bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-4" : "pt-32 pb-8"
      )}>
        <div className="max-w-3xl px-6 mx-auto">
          <motion.div 
            layout
            className="flex flex-col items-center gap-8"
          >
            {!debouncedQuery && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-2">
                  S<span className="text-orange-600">ALT</span>
                </h1>
                <p className="text-xs text-gray-400 uppercase tracking-[0.25em] font-semibold mb-4">
                  South African Lineage Tracer
                </p>
                <p className="text-lg text-gray-500 max-w-md mx-auto">
                  Search thousands of pages of deeply indexed historical archives to uncover your South African lineage.
                </p>
              </motion.div>
            )}

            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                {indexing ? (
                  <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                )}
              </div>
              <input
                type="text"
                className="w-full py-4 pl-14 pr-6 text-lg bg-white border border-gray-200 rounded-full shadow-sm outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-400"
                placeholder="Search by name, profession, or year..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {indexing && !error && (
                <div className="absolute -bottom-6 left-6 right-6">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-orange-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                    Loading search index... {Math.round(progress * 100)}%
                  </p>
                </div>
              )}
              {error && (
                <p className="absolute -bottom-6 left-6 text-xs text-red-500">
                  {error}
                </p>
              )}
            </div>

            {debouncedQuery && (
              <div className="w-full flex items-center gap-4 text-sm text-gray-500 px-2">
                <span>{results.length} results found</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>{totalIndexed} pages indexed</span>
              </div>
            )}
          </motion.div>
        </div>
      </header>

      {/* Results Area */}
      <main className="max-w-3xl px-6 py-8 mx-auto">
        <AnimatePresence mode="wait">
          {debouncedQuery ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <motion.div
                    key={`${result.bookId}-${result.pageNumber}-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => handleResultClick(result)}
                    className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-3 mt-2">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 text-xs font-medium text-gray-600 border border-gray-100">
                            <BookIcon className="w-3.5 h-3.5" />
                            {BOOKS.find(b => b.id === result.bookId)?.title}
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-orange-50 text-xs font-medium text-orange-700 border border-orange-100">
                            Page {result.pageNumber}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-orange-400 transition-colors" />
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {result.context}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No matches found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or filters.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-6 py-12"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => window.open(GITHUB_URL, '_blank')}
                  className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
                >
                  <div className="p-2 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
                    <Github className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">View Source</p>
                    <p className="text-xs text-gray-400">Open on GitHub</p>
                  </div>
                </button>
                <button
                  onClick={() => setShowAbout(true)}
                  className="flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
                >
                  <div className="p-2 bg-orange-50 rounded-xl text-orange-600 group-hover:bg-orange-100 transition-colors">
                    <Info className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-900">About SALT</p>
                    <p className="text-xs text-gray-400">Our mission & support</p>
                  </div>
                </button>
              </div>
              <p className="text-xs text-gray-400 text-center max-w-xs">
                Digitally archiving South African Indian history for future generations. {totalIndexed} pages indexed across {indexes.size} volumes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* PDF Viewer Modal */}
      {selectedResult && !showAbout && (
        <PdfViewer
          fileUrl={BOOKS.find(b => b.id === selectedResult.bookId)?.pdfPath || ''}
          bookId={selectedResult.bookId}
          initialPage={selectedResult.pageNumber}
          title={BOOKS.find(b => b.id === selectedResult.bookId)?.title || 'PDF Viewer'}
          onClose={() => setSelectedResult(null)}
        />
      )}

      {/* About Page Modal */}
      <AnimatePresence>
        {showAbout && (
          <AboutPage
            onClose={() => setShowAbout(false)}
            onViewSource={() => window.open(GITHUB_URL, '_blank')}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
