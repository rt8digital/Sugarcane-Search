import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2, Search, ChevronUp, ChevronDown, Camera, BookMarked } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { useResearch } from '../hooks/useResearch';
import { SearchResult } from '../types';
import { Button } from '@/components/ui/button';

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

GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

interface PdfViewerContentProps {
  result: SearchResult;
  onClose: () => void;
}

export default function PdfViewerContent({ result, onClose }: PdfViewerContentProps) {
  const { pdfPath, bookTitle, page: initialPage, matchedTerms, record } = result;
  const { addCapture } = useResearch();
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

  const [isSelectingCrop, setIsSelectingCrop] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number, y: number } | null>(null);
  const [cropCurrent, setCropCurrent] = useState<{ x: number, y: number } | null>(null);
  const [pdfTextIndex, setPdfTextIndex] = useState<Map<number, TextItem[]>>(new Map());

  useEffect(() => {
    setDocLoading(true);
    setLoadProgress(0);
    let cancelled = false;

    const task = getDocument({
      url: pdfPath,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@5.6.205/cmaps/',
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
    if (matchedTerms && matchedTerms.length > 0 && !searchQuery) {
      setSearchQuery(matchedTerms.join(' '));
    }
  }, [matchedTerms]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) searchPdf();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, searchPdf]);

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

      if (overlayRef.current && (matchedTerms && matchedTerms.length > 0 || searchMatches.length > 0)) {
        const textContent = await page.getTextContent();
        const overlay = overlayRef.current;
        overlay.width = viewport.width;
        overlay.height = viewport.height;
        const octx = overlay.getContext('2d')!;
        octx.clearRect(0, 0, overlay.width, overlay.height);

        octx.fillStyle = 'rgba(176, 104, 32, 0.22)';
        octx.strokeStyle = 'rgba(176, 104, 32, 0.45)';
        octx.lineWidth = 1;

        const termsLower = matchedTerms
          ? matchedTerms.map((t) => t.toLowerCase().trim()).filter(Boolean)
          : [];

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
  }, [pdf, currentPage, scale, matchedTerms, searchQuery]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);

  const toggleCropMode = () => {
    setIsSelectingCrop(!isSelectingCrop);
    setCropStart(null);
    setCropCurrent(null);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectingCrop) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCropStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCropCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelectingCrop || !cropStart) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setCropCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseUp = () => {
    if (!isSelectingCrop || !cropStart || !cropCurrent) {
      setCropStart(null);
      setCropCurrent(null);
      return;
    }

    if (!canvasRef.current) return;

    const x = Math.min(cropStart.x, cropCurrent.x);
    const y = Math.min(cropStart.y, cropCurrent.y);
    const width = Math.abs(cropCurrent.x - cropStart.x);
    const height = Math.abs(cropCurrent.y - cropStart.y);

    if (width > 20 && height > 20) {
      const pdfOutputScale = window.devicePixelRatio || 1;
      const offCanvas = document.createElement('canvas');
      offCanvas.width = width * pdfOutputScale;
      offCanvas.height = height * pdfOutputScale;

      const ctx = offCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(
          canvasRef.current,
          x * pdfOutputScale, y * pdfOutputScale, width * pdfOutputScale, height * pdfOutputScale,
          0, 0, width * pdfOutputScale, height * pdfOutputScale
        );
        const image = offCanvas.toDataURL('image/jpeg', 0.9);
        addCapture({ image, bookTitle, page: currentPage });
        alert(`Selected snippet of ${bookTitle} (Page ${currentPage}) added to your Research Panel.`);
      }
    }

    setIsSelectingCrop(false);
    setCropStart(null);
    setCropCurrent(null);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-[#2D3A31]/90 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          className="w-full max-w-7xl h-full flex flex-col bg-[#F9F8F4] rounded-3xl shadow-2xl border border-[#E6E2DA] overflow-hidden"
          initial={{ y: 20, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0, scale: 0.98 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Topbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 border-b border-[#E6E2DA] bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col flex-1 min-w-[200px]">
              <span className="font-bold text-[#2D3A31] text-sm truncate">{bookTitle}</span>
              <span className="text-xs text-[#6B7A68] font-semibold uppercase tracking-wider mt-0.5">Page {currentPage} of {totalPages || '--'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {/* Search */}
              <div className="flex items-center bg-white border border-[#E6E2DA] rounded-full px-4 h-10">
                <Search size={15} strokeWidth={1.5} className="text-[#6B7A68] mr-2 shrink-0" />
                <input
                  type="text"
                  className="bg-transparent text-sm w-28 sm:w-36 focus:outline-none text-[#2D3A31] placeholder:text-[#6B7A68]/50"
                  placeholder="Find on page..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchMatches.length > 0 && (
                  <span className="text-[10px] font-semibold text-[#8C9A84] bg-[#8C9A84]/10 px-2 py-0.5 rounded-full ml-2 shrink-0">
                    {currentMatchIndex + 1} / {searchMatches.length}
                  </span>
                )}
                <div className="flex items-center border-l border-[#E6E2DA] ml-2 pl-2 shrink-0">
                  <button className="p-1.5 hover:bg-[#F2F0EB] text-[#6B7A68] hover:text-[#2D3A31] rounded-full transition-colors disabled:opacity-30" onClick={goToPrevMatch} disabled={searchMatches.length <= 1} aria-label="Previous match"><ChevronUp size={15} strokeWidth={1.5} /></button>
                  <button className="p-1.5 hover:bg-[#F2F0EB] text-[#6B7A68] hover:text-[#2D3A31] rounded-full transition-colors disabled:opacity-30" onClick={goToNextMatch} disabled={searchMatches.length <= 1} aria-label="Next match"><ChevronDown size={15} strokeWidth={1.5} /></button>
                </div>
              </div>

              {/* Zoom */}
              <div className="flex items-center bg-white border border-[#E6E2DA] rounded-full h-10 shrink-0">
                <button className="p-2 hover:bg-[#F2F0EB] text-[#6B7A68] hover:text-[#2D3A31] transition-colors border-r border-[#E6E2DA]" onClick={() => setScale(s => Math.max(0.2, s - 0.2))} title="Zoom out" aria-label="Zoom out"><ZoomOut size={15} strokeWidth={1.5} /></button>
                <span className="text-xs font-semibold font-mono px-4 w-[60px] text-center text-[#2D3A31]">{Math.round(scale * 100)}%</span>
                <button className="p-2 hover:bg-[#F2F0EB] text-[#6B7A68] hover:text-[#2D3A31] transition-colors border-l border-[#E6E2DA]" onClick={() => setScale(s => Math.min(3, s + 0.2))} title="Zoom in" aria-label="Zoom in"><ZoomIn size={15} strokeWidth={1.5} /></button>
                <button className="p-2 hover:bg-[#F2F0EB] text-[#6B7A68] hover:text-[#2D3A31] transition-colors border-l border-[#E6E2DA]" onClick={fitToWidth} title="Fit to width" aria-label="Fit to width"><Maximize2 size={15} strokeWidth={1.5} /></button>
              </div>

              {/* Crop */}
              <button
                className={`flex items-center justify-center p-2.5 border rounded-full transition-colors shrink-0 h-10 w-10 ${isSelectingCrop ? 'bg-[#8C9A84] border-[#8C9A84] text-white shadow-md' : 'bg-white border-[#E6E2DA] text-[#6B7A68] hover:text-[#2D3A31] hover:bg-[#F2F0EB]'}`}
                onClick={toggleCropMode}
                title="Select portion to capture"
                aria-label="Toggle crop mode"
              >
                <Camera size={16} strokeWidth={1.5} />
              </button>

              {/* Page Navigation */}
              <div className="flex items-center bg-white border border-[#E6E2DA] rounded-full h-10 shrink-0">
                <button className="p-2 hover:bg-[#F2F0EB] text-[#6B7A68] hover:text-[#2D3A31] transition-colors border-r border-[#E6E2DA] disabled:opacity-30" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => p - 1)} aria-label="Previous page"><ChevronLeft size={16} strokeWidth={1.5} /></button>
                <button className="p-2 hover:bg-[#F2F0EB] text-[#6B7A68] hover:text-[#2D3A31] transition-colors disabled:opacity-30" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} aria-label="Next page"><ChevronRight size={16} strokeWidth={1.5} /></button>
              </div>

              {/* Close */}
              <button className="p-2.5 bg-[#C27B66]/10 text-[#C27B66] hover:bg-[#C27B66] hover:text-white rounded-full transition-all duration-300 shrink-0" onClick={onClose} title="Close viewer" aria-label="Close viewer">
                <X size={17} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* PDF Canvas Area */}
          <div className="flex-1 overflow-auto bg-[#1a1c1e] flex items-start justify-center p-6 sm:p-10 relative" ref={containerRef}>
            {docLoading && loadProgress < 100 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F9F8F4]/90 backdrop-blur-sm z-50">
                <div className="w-72 space-y-4">
                  <div className="h-2 w-full bg-[#F2F0EB] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8C9A84] rounded-full transition-all duration-300 ease-out" style={{ width: `${loadProgress}%` }} />
                  </div>
                  <p className="text-center text-sm font-medium text-[#6B7A68]">Loading archives: {loadProgress}%</p>
                </div>
              </div>
            )}
            {(pageLoading && !docLoading) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-50 pointer-events-none">
                <div className="bg-white/95 backdrop-blur-sm shadow-xl border border-[#E6E2DA] px-8 py-5 rounded-2xl flex items-center gap-4">
                  <Loader2 size={24} className="animate-spin text-[#8C9A84]" strokeWidth={1.5} />
                  <span className="font-semibold text-[#2D3A31]">Loading Page {currentPage}...</span>
                </div>
              </div>
            )}
            <div
              className="relative shadow-2xl bg-white transition-opacity duration-300 flex-shrink-0"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{
                cursor: isSelectingCrop ? 'crosshair' : 'default',
                opacity: (pageLoading && !docLoading) ? 0.5 : 1
              }}
            >
              <canvas ref={canvasRef} />
              <canvas
                ref={overlayRef}
                className="absolute top-0 left-0 pointer-events-none"
              />
              {isSelectingCrop && cropStart && cropCurrent && (
                <div
                  className="absolute pointer-events-none z-20 border-2 border-[#8C9A84] bg-[#8C9A84]/20 rounded-lg"
                  style={{
                    left: Math.min(cropStart.x, cropCurrent.x),
                    top: Math.min(cropStart.y, cropCurrent.y),
                    width: Math.abs(cropCurrent.x - cropStart.x),
                    height: Math.abs(cropCurrent.y - cropStart.y),
                  }}
                />
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-5 border-t border-[#E6E2DA] bg-white/80 backdrop-blur-sm gap-4">
            <div className="text-sm text-[#6B7A68]">
              Archive Volume: <strong className="text-[#2D3A31]">{bookTitle}</strong>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#6B7A68] font-medium">Jump to Page:</span>
              <input
                type="number"
                className="w-20 h-10 bg-white border border-[#E6E2DA] rounded-xl px-3 focus:outline-none focus:ring-2 focus:ring-[#8C9A84]/20 focus:border-[#8C9A84]/40 text-[#2D3A31] text-center font-semibold"
                value={currentPage}
                min={1}
                max={totalPages}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val > 0 && val <= totalPages) setCurrentPage(val);
                }}
                aria-label="Jump to page"
              />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
