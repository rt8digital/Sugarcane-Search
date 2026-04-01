import React, { useEffect, useRef, useState, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { SearchResult } from '../types';

// Lazy load PDF.js to reduce initial bundle
const PdfViewerContent = lazy(() => import('./PdfViewerContent'));

interface PdfViewerProps {
  result: SearchResult;
  onClose: () => void;
}

export function PdfViewer({ result, onClose }: PdfViewerProps) {
  return (
    <Suspense fallback={<PdfViewerLoader onClose={onClose} />}>
      <PdfViewerContent result={result} onClose={onClose} />
    </Suspense>
  );
}

// Loader component shown while PDF viewer loads
function PdfViewerLoader({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="w-full max-w-4xl bg-card rounded-2xl shadow-xl border border-border overflow-hidden"
        initial={{ y: 20, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 20, opacity: 0, scale: 0.98 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="font-semibold text-foreground">Loading PDF viewer...</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="h-[60vh] flex items-center justify-center bg-muted/30">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground font-medium">Preparing archive document...</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
