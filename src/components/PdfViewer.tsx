import React from 'react';
import { Viewer, Worker, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PdfViewerProps {
  fileUrl: string;
  bookId: string;
  initialPage?: number;
  onClose: () => void;
  title: string;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl, bookId, initialPage = 1, onClose, title }) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex flex-col bg-white/80 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200/50 bg-white/50">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-500">Page {initialPage}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 transition-colors rounded-full hover:bg-gray-100 text-gray-500"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={fileUrl}
              initialPage={initialPage - 1}
              plugins={[defaultLayoutPluginInstance]}
              defaultScale={SpecialZoomLevel.PageFit}
            />
          </Worker>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PdfViewer;
