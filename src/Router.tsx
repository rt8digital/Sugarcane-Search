import React, { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/PageTransition';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ResearchPanel } from './components/ResearchPanel';
import { LayoutProvider, useLayout } from './contexts/LayoutContext';

// Lazy load page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const AboutPage = lazy(() => import('./components/AboutPage').then(module => ({ default: module.AboutPage })));
const ContributePage = lazy(() => import('./components/ContributePage'));
const SourcesPage = lazy(() => import('./components/SourcesPage'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-primary/30 border-t-primary rounded-md animate-spin" />
        <p className="text-sm text-muted-foreground font-medium font-body">Loading archive...</p>
      </div>
    </div>
  );
}

function LayoutContent() {
  const location = useLocation();
  const { isPdfViewerOpen, isResearchPanelOpen, setIsResearchPanelOpen } = useLayout();
  const [localResearchOpen, setLocalResearchOpen] = useState(false);

  const handleResearchToggle = (open: boolean) => {
    setLocalResearchOpen(open);
    setIsResearchPanelOpen(open);
  };

  // Show header/footer on all pages except results
  const showHeaderFooter = !isPdfViewerOpen && location.pathname !== '/search';

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Paper Grain Texture - Global */}
      <div className="paper-grain" />

      {showHeaderFooter && <Header />}

      <main className="flex-1 w-full flex flex-col items-center relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition><HomePage /></PageTransition>
                </Suspense>
              }
            />
            <Route
              path="/search"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition><ResultsPage /></PageTransition>
                </Suspense>
              }
            />
            <Route
              path="/about"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition><AboutPage /></PageTransition>
                </Suspense>
              }
            />
            <Route
              path="/contribute"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition><ContributePage /></PageTransition>
                </Suspense>
              }
            />
            <Route
              path="/sources"
              element={
                <Suspense fallback={<PageLoader />}>
                  <PageTransition><SourcesPage /></PageTransition>
                </Suspense>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>

      {showHeaderFooter && <Footer />}

      {/* Research Panel Trigger - Only show on home/about/sources/contribute pages */}
      {!isResearchPanelOpen && !isPdfViewerOpen && location.pathname !== '/search' && (
        <button
          className="fixed bottom-8 right-8 w-14 h-14 bg-foreground text-primary-foreground shadow-lg rounded-md flex items-center justify-center text-2xl hover:bg-primary transition-all z-[90] group"
          onClick={() => handleResearchToggle(true)}
          title="Open Research Notes"
          aria-label="Open research panel"
        >
          <span className="group-hover:rotate-12 transition-transform">🗒️</span>
        </button>
      )}

      <ResearchPanel
        isOpen={isResearchPanelOpen || localResearchOpen}
        onClose={() => {
          handleResearchToggle(false);
          setLocalResearchOpen(false);
        }}
      />
    </div>
  );
}

export function Router() {
  return (
    <BrowserRouter>
      <LayoutProvider>
        <LayoutContent />
      </LayoutProvider>
    </BrowserRouter>
  );
}
