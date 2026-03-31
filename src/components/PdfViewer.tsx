import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2, Loader2, Info } from 'lucide-react';
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

// Use CDN worker
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
  const [scale, setScale] = useState(1.5);
  const [pageLoading, setPageLoading] = useState(true);
  const [docLoading, setDocLoading] = useState(true);

  // Load PDF document
  useEffect(() => {
    setDocLoading(true);
    const task = getDocument(pdfPath);
    task.promise.then((doc: PDFDocumentProxy) => {
      setPdf(doc);
      setTotalPages(doc.numPages);
      setDocLoading(false);
    }).catch((err: Error) => {
      console.error('PDF load error:', err);
      setDocLoading(false);
    });
    return () => { task.destroy(); };
  }, [pdfPath]);

  const fitToWidth = useCallback(() => {
    if (!containerRef.current) return;
    const padding = 40;
    const width = containerRef.current.clientWidth - padding;
    setScale(width / 600); // 600 is a rough page width
  }, []);

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

      // Draw highlights
      if (overlayRef.current && highlights.length > 0) {
        const textContent = await page.getTextContent();
        const overlay = overlayRef.current;
        overlay.width = viewport.width;
        overlay.height = viewport.height;
        const octx = overlay.getContext('2d')!;
        octx.clearRect(0, 0, overlay.width, overlay.height);
        
        // Premium highlight style
        octx.fillStyle = 'rgba(176, 104, 32, 0.22)';
        octx.strokeStyle = 'rgba(176, 104, 32, 0.45)';
        octx.lineWidth = 1;

        const termsLower = highlights.map((t) => t.toLowerCase().trim()).filter(Boolean);
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

        // Auto-scroll logic
        if (firstMatchY !== null && containerRef.current) {
          const container = containerRef.current;
          container.scrollTo({
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
  }, [pdf, currentPage, scale, highlights]);

  useEffect(() => {
    renderPage();
  }, [renderPage]);

  // Page tracking for records
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
          {/* Header */}
          <div className="pdf-topbar">
            <div className="pdf-title-wrap">
              <span className="pdf-book-title">{bookTitle}</span>
              <span className="pdf-page-count">Vol. {currentPage} / {totalPages}</span>
            </div>
            
            <div className="pdf-controls">
              <div className="pdf-zoom-group">
                <button className="pdf-ctrl-btn" onClick={() => setScale(s => s - 0.2)}><ZoomOut size={16}/></button>
                <span className="pdf-zoom-val">{Math.round(scale * 100)}%</span>
                <button className="pdf-ctrl-btn" onClick={() => setScale(s => s + 0.2)}><ZoomIn size={16}/></button>
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

          {/* Canvas */}
          <div className="pdf-canvas-area museum-bg" ref={containerRef}>
            {(docLoading || pageLoading) && (
              <div className="pdf-loading-overlay">
                <Loader2 size={32} className="spin gold-text" />
                <span>{docLoading ? 'Opening Archive...' : 'Restoring Page...'}</span>
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

          {/* Footer Nav */}
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
