import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LayoutContextType {
  isPdfViewerOpen: boolean;
  setIsPdfViewerOpen: (open: boolean) => void;
  isResearchPanelOpen: boolean;
  setIsResearchPanelOpen: (open: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [isResearchPanelOpen, setIsResearchPanelOpen] = useState(false);

  return (
    <LayoutContext.Provider
      value={{
        isPdfViewerOpen,
        setIsPdfViewerOpen,
        isResearchPanelOpen,
        setIsResearchPanelOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
