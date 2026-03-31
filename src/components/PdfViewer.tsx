import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2, Search, ChevronUp, ChevronDown } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { BiographicalRecord } from '../types';

const { GlobalWorkerOptions, getDocument, Util } = pdfjsLib;
type PDFDocumentProxy = any;
type RenderTask = any;

interface TextItem {
  str: string;
  width: number;
  height: number;
  transform: number[];
}

interface SearchMatch {
  page: number;
  text: string;
  y: number;
}

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

interface PdfViewerProps {
  pdfPath: string;
  bookTitle: string;
  initialPage: number;
  highlights: string[];
  records?: BiographicalRecord[];
  onClose: () => void;
}

export function PdfViewer({ pdfPath, bookTitle, initialPage, highlights, records, onClose }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(0.5);
  const [pageLoading, setPageLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatches, setSearchMatches] = useState<SearchMatch[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const [pdfTextIndex, setPdfTextIndex] = useState<Map<number, TextItem[]>>(new Map());

  useEffect(() => {
    setDocLoading(true);
    setLoadProgress(0);
    let cancelled = false;
    
    const task = getDocument({
      url: pdfPath,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    });
    
    task.onProgress = (progress: { loaded: number; total: number }) => {
      if (!cancelled && progress.total > 0) {
        setLoadProgress(Math.round((progress.loaded / progress.total) * 100));
      }
    };
    
    task.promise.then((doc: PDFDocumentProxy) => {
      if (!cancelled) {
        setPdf(doc);
        setTotalPages(doc.numPages);
        setDocLoading(false);
        setLoadProgress(100);
      }
    }).catch((err: Error) => {
      if (!cancelled) {
        console.error('PDF load error:', err);
        setDocLoading(false);
        setLoadProgress(100);
      }
    });
    
    return () => {
      cancelled = true;
      task.destroy();
    };
  }, [pdfPath]);

  const fitToWidth = useCallback(() => {
    if (!containerRef.current) return;
    const padding = 40;
    const maxWidth = window.innerWidth * 0.95 - padding;
    const maxHeight = window.innerHeight * 0.85;
    const widthScale = maxWidth / 600;
    const heightScale = maxHeight / 800;
    setScale(Math.min(widthScale, heightScale, 2));
  }, []);

  useEffect(() => {
    const handleResize = () => fitToWidth();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [fitToWidth]);

  useEffect(() => {
    setTimeout(fitToWidth, 100);
  }, [pdf, fitToWidth]);

  const buildTextIndex = useCallback(async () => {
    if (!pdf) return;
    const index = new Map<number, TextItem[]>();
    for (let p = 1; p <= totalPages; p++) {
      const page = await pdf.getPage(p);
      const textContent = await page.getTextContent();
      index.set(p, textContent.items as unknown as TextItem[]);
    }
    setPdfTextIndex(index);
  }, [pdf, totalPages]);

  const searchPdf = useCallback(async () => {
    if (!pdf || !searchQuery.trim()) {
      setSearchMatches([]);
      return;
    }

    const matches: SearchMatch[] = [];
    const query = searchQuery.toLowerCase().trim();
    
    let textIndex = pdfTextIndex;
    if (textIndex.size === 0) {
      await buildTextIndex();
      textIndex = pdfTextIndex;
    }

    for (const [pageNum, items] of textIndex) {
      for (const item of items) {
        if (item.str?.toLowerCase().includes(query)) {
          matches.push({ page: pageNum, text: item.str, y: item.transform?.[5] || 0 });
        }
      }
    }

    setSearchMatches(matches);
    setCurrentMatchIndex(0);

    if (matches.length > 0) {
      setCurrentPage(matches[0].page);
    }
  }, [pdf, searchQuery, pdfTextIndex, buildTextIndex]);

  useEffect(() => {
    if (highlights && highlights.length > 0 && !searchQuery) {
      setSearchQuery(highlights.join(' '));
    }
  }, [highlights]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchPdf();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const goToNextMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIndex);
    const match = searchMatches[nextIndex];
    setCurrentPage(match.page);
    setTimeout(() => {
      if (containerRef.current) {
        const scrollTarget = Math.max(0, match.y - 150);
        containerRef.current.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
    }, 100);
  };

  const goToPrevMatch = () => {
    if (searchMatches.length === 0) return;
    const prevIndex = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length;
    setCurrentMatchIndex(prevIndex);
    const match = searchMatches[prevIndex];
    setCurrentPage(match.page);
    setTimeout(() => {
      if (containerRef.current) {
        const scrollTarget = Math.max(0, match.y - 150);
        containerRef.current.scrollTo({ top: scrollTarget, behavior: 'smooth' });
      }
    }, 100);
  };

  const renderPage = useCallback(async () => {
    if (!pdf || !canvasRef.current) return;
    setPageLoading(true);

    if (renderTaskRef.current) {
      renderTaskRef.current.cancel();
    }

    const page = await pdf.getPage(currentPage);
    const viewport = page.getViewport({ scale });

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const task = page.render({ canvasContext: ctx, viewport });
    renderTaskRef.current = task;

    try {
      await task.promise;

      if (overlayRef.current && (highlights.length > 0 || searchMatches.length > 0)) {
        const textContent = await page.getTextContent();
        const overlay = overlayRef.current;
        overlay.width = viewport.width;
        overlay.height = viewport.height;
        const octx = overlay.getContext('2d')!;
        octx.clearRect(0, 0, overlay.width, overlay.height);
        
        octx.fillStyle = 'rgba(176, 104, 32, 0.22)';
        octx.strokeStyle = 'rgba(176, 104, 32, 0.45)';
        octx.lineWidth = 1;

        const termsLower = highlights
          .map((t) => t.toLowerCase().trim())
          .filter(Boolean);
        
        // Also include current search query
        if (searchQuery) {
          termsLower.push(searchQuery.toLowerCase());
        }

        let firstMatchY: number | null = null;

        for (const item of textContent.items as unknown as TextItem[]) {
          if (!item.str?.trim()) continue;
          const matched = termsLower.some((t) => item.str.toLowerCase().includes(t));
          if (!matched) continue;

          const tx = Util.transform(viewport.transform, item.transform);
          const fontHeight = Math.abs(tx[3]);
          const width = item.width * viewport.scale;
          
          octx.fillRect(tx[4], tx[5] - fontHeight, width, fontHeight);
          octx.strokeRect(tx[4], tx[5] - fontHeight, width, fontHeight);

          if (firstMatchY === null || tx[5] < firstMatchY) {
            firstMatchY = tx[5] - fontHeight;
          }
        }

        if (firstMatchY !== null && containerRef.current) {
          containerRef.current.scrollTo({
            top: Math.max(0, firstMatchY - 100),
            behavior: 'smooth'
          });
        }
      }

      setPageLoading(false);
    } catch (e: any) {
      if (e.message !== 'Rendering cancelled') {
        console.error('Render error:', e);
      }
      setPageLoading(false);
    }
  }, [pdf, currentPage, scale, highlights, searchQuery]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  return (
    <AnimatePresence>
      <motion.div
        className="pdf-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="pdf-panel"
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.98 }}
        >
          <div className="pdf-topbar">
            <div className="pdf-title-wrap">
              <span className="pdf-book-title">{bookTitle}</span>
              <span className="pdf-page-count">Vol. {currentPage} / {totalPages}</span>
            </div>
            
            <div className="pdf-controls">
              <div className="pdf-search-group">
                <Search size={14} className="pdf-search-icon" />
                <input
                  type="text"
                  className="pdf-search-input"
                  placeholder="Search within PDF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <span className="pdf-search-count">
                    {searchMatches.length > 0 
                      ? `${currentMatchIndex + 1}/${searchMatches.length}` 
                      : '0 results'}
                  </span>
                )}
                {searchMatches.length > 0 && (
                  <>
                    <button className="pdf-ctrl-btn" onClick={goToPrevMatch} title="Previous match">
                      <ChevronUp size={14} />
                    </button>
                    <button className="pdf-ctrl-btn" onClick={goToNextMatch} title="Next match">
                      <ChevronDown size={14} />
                    </button>
                  </>
                )}
              </div>
              
              <div className="pdf-zoom-group">
                <button className="pdf-ctrl-btn" onClick={() => setScale(s => Math.max(0.2, s - 0.2))}><ZoomOut size={16}/></button>
                <span className="pdf-zoom-val">{Math.round(scale * 100)}%</span>
                <button className="pdf-ctrl-btn" onClick={() => setScale(s => Math.min(3, s + 0.2))}><ZoomIn size={16}/></button>
                <button className="pdf-ctrl-btn" onClick={fitToWidth} title="Fit to width"><Maximize2 size={16}/></button>
              </div>
              
              <div className="pdf-nav-group">
                <button className="pdf-ctrl-btn" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)}>
                  <ChevronLeft size={18}/>
                </button>
                <button className="pdf-ctrl-btn" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)}>
                  <ChevronRight size={18}/>
                </button>
              </div>

              <button className="pdf-close-btn-round" onClick={onClose}><X size={20}/></button>
            </div>
          </div>

          <div className="pdf-canvas-area museum-bg" ref={containerRef}>
            {docLoading && loadProgress < 100 && (
              <div className="pdf-loading-overlay">
                <div className="pdf-progress-wrap">
                  <div className="pdf-progress-bar">
                    <div className="pdf-progress-fill" style={{ width: `${loadProgress}%` }} />
                  </div>
                  <span className="pdf-progress-text">Loading archive: {loadProgress}%</span>
                </div>
              </div>
            )}
            {(pageLoading && !docLoading) && (
              <div className="pdf-loading-overlay">
                <Loader2 size={32} className="spin gold-text" />
                <span>Restoring Page {currentPage}...</span>
              </div>
            )}
            <div className="pdf-canvas-wrap heritage-shadow">
              <canvas ref={canvasRef} />
              <canvas
                ref={overlayRef}
                style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
              />
            </div>
          </div>

          <div className="pdf-pagebar-refined">
             <div className="page-indicator">
               Digitised Page: <strong>{currentPage}</strong> of {totalPages}
             </div>
             <div className="page-jump">
               Go to: <input type="number" value={currentPage} onChange={(e) => setCurrentPage(Number(e.target.value))} />
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}