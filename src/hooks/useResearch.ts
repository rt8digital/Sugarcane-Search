import { useState, useEffect, useCallback } from 'react';

export interface ResearchCapture {
  id: string;
  image: string; // base64
  timestamp: string;
  bookTitle?: string;
  bookYear?: string;
  page?: number;
  notes?: string;
  collectionId?: string;
  tags?: string[];
}

export interface ResearchCollection {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  color: string;
}

export interface ResearchState {
  notes: string;
  captures: ResearchCapture[];
  collections: ResearchCollection[];
}

const COLLECTION_COLORS = [
  '#E03C31', // SA Red
  '#007749', // SA Green
  '#001489', // SA Blue
  '#FFB81C', // SA Yellow
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function useResearch() {
  const [research, setResearch] = useState<ResearchState>(() => {
    try {
      const saved = localStorage.getItem('SALT_research_v2');
      return saved ? JSON.parse(saved) : { notes: '', captures: [], collections: [] };
    } catch {
      return { notes: '', captures: [], collections: [] };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('SALT_research_v2', JSON.stringify(research));
    } catch (error) {
      console.error('Failed to save research data:', error);
      // Handle localStorage quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Research storage is full. Please export and clear some items.');
      }
    }
  }, [research]);

  const updateNotes = useCallback((notes: string) => {
    setResearch(prev => ({ ...prev, notes }));
  }, []);

  const addCapture = useCallback((capture: Omit<ResearchCapture, 'id' | 'timestamp'>) => {
    const newCapture: ResearchCapture = {
      ...capture,
      id: generateId(),
      timestamp: new Date().toISOString(),
      tags: capture.tags || [],
    };
    setResearch(prev => ({
      ...prev,
      captures: [newCapture, ...prev.captures],
    }));
    return newCapture.id;
  }, []);

  const removeCapture = useCallback((id: string) => {
    setResearch(prev => ({
      ...prev,
      captures: prev.captures.filter(c => c.id !== id),
    }));
  }, []);

  const updateCaptureNotes = useCallback((id: string, notes: string) => {
    setResearch(prev => ({
      ...prev,
      captures: prev.captures.map(c => c.id === id ? { ...c, notes } : c),
    }));
  }, []);

  const updateCaptureTags = useCallback((id: string, tags: string[]) => {
    setResearch(prev => ({
      ...prev,
      captures: prev.captures.map(c => c.id === id ? { ...c, tags } : c),
    }));
  }, []);

  const assignCaptureToCollection = useCallback((captureId: string, collectionId: string | null) => {
    setResearch(prev => ({
      ...prev,
      captures: prev.captures.map(c => c.id === captureId ? { ...c, collectionId: collectionId || undefined } : c),
    }));
  }, []);

  const addCollection = useCallback((name: string, description?: string) => {
    const color = COLLECTION_COLORS[Math.floor(Math.random() * COLLECTION_COLORS.length)];
    const newCollection: ResearchCollection = {
      id: generateId(),
      name,
      description,
      createdAt: new Date().toISOString(),
      color,
    };
    setResearch(prev => ({
      ...prev,
      collections: [...prev.collections, newCollection],
    }));
    return newCollection;
  }, []);

  const removeCollection = useCallback((id: string) => {
    setResearch(prev => ({
      ...prev,
      collections: prev.collections.filter(c => c.id !== id),
      captures: prev.captures.map(c => c.collectionId === id ? { ...c, collectionId: undefined } : c),
    }));
  }, []);

  const updateCollection = useCallback((id: string, updates: Partial<ResearchCollection>) => {
    setResearch(prev => ({
      ...prev,
      collections: prev.collections.map(c => c.id === id ? { ...c, ...updates } : c),
    }));
  }, []);

  const clearResearch = useCallback(() => {
    if (window.confirm('Are you sure you want to clear all research data? This cannot be undone.')) {
      setResearch({ notes: '', captures: [], collections: [] });
    }
  }, []);

  const exportToMarkdown = useCallback(() => {
    let md = `# Research Findings - SALT (South African Lineage Tracer)\n\n`;
    md += `Generated: ${new Date().toLocaleString('en-ZA', { dateStyle: 'long', timeStyle: 'short' })}\n\n`;
    md += `---\n\n`;

    // Notes section
    md += `## Research Notes\n\n${research.notes || '_No notes recorded._'}\n\n`;

    // Collections overview
    if (research.collections.length > 0) {
      md += `## Collections\n\n`;
      research.collections.forEach(col => {
        const count = research.captures.filter(c => c.collectionId === col.id).length;
        md += `- **${col.name}** (${count} items)${col.description ? `: ${col.description}` : ''}\n`;
      });
      md += `\n---\n\n`;
    }

    // Captures by collection
    if (research.captures.length > 0) {
      md += `## Captured Records\n\n`;
      
      // Group by collection
      const byCollection = new Map<string | undefined, ResearchCapture[]>();
      research.captures.forEach(cap => {
        const key = cap.collectionId;
        const arr = byCollection.get(key) || [];
        arr.push(cap);
        byCollection.set(key, arr);
      });

      // Uncollected first
      const uncollected = byCollection.get(undefined);
      if (uncollected && uncollected.length > 0) {
        md += `### Uncollected\n\n`;
        uncollected.forEach((cap, i) => {
          md += formatCaptureMarkdown(cap, i + 1);
        });
        md += `\n`;
      }

      // Then by collection
      research.collections.forEach(col => {
        const captures = byCollection.get(col.id);
        if (captures && captures.length > 0) {
          md += `### ${col.name}\n\n`;
          captures.forEach((cap, i) => {
            md += formatCaptureMarkdown(cap, i + 1, col);
          });
          md += `\n`;
        }
      });
    }

    md += `\n---\n\n*Exported from SALT – South African Lineage Tracer*`;

    navigator.clipboard.writeText(md).then(() => {
      alert('Research exported to clipboard as Markdown!');
    }).catch(() => {
      // Fallback: download as file
      downloadAsFile(md, 'research-findings.md', 'text/markdown');
    });
  }, [research]);

  const exportToPDF = useCallback(() => {
    // Create print-friendly HTML
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    let content = '';
    research.captures.forEach(cap => {
      content += `
        <div style="page-break-inside: avoid; margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 8px;">
          <h4 style="margin: 0 0 8px 0; color: #333;">${cap.bookTitle || 'Unknown'} - Page ${cap.page || '?'}</h4>
          ${cap.notes ? `<p style="margin: 8px 0; color: #666; font-style: italic;">${cap.notes}</p>` : ''}
          <img src="${cap.image}" style="max-width: 100%; height: auto;" />
        </div>
      `;
    });

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SALT Research Export</title>
          <style>
            body { font-family: Georgia, serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #007749; border-bottom: 2px solid #007749; padding-bottom: 10px; }
            h2 { color: #333; margin-top: 30px; }
            .notes { background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0; }
            img { max-width: 100%; height: auto; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          <h1>Research Findings</h1>
          <p><em>Generated: ${new Date().toLocaleString('en-ZA')}</em></p>
          
          <div class="notes">
            <h3>Research Notes</h3>
            <p>${research.notes || 'No notes.'}</p>
          </div>
          
          <h2>Captured Records (${research.captures.length})</h2>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [research]);

  const downloadAsJSON = useCallback(() => {
    const data = JSON.stringify(research, null, 2);
    downloadAsFile(data, 'salt-research.json', 'application/json');
  }, [research]);

  const getCaptionsByCollection = useCallback((collectionId: string | undefined) => {
    return research.captures.filter(c => c.collectionId === collectionId);
  }, [research.captures]);

  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    research.captures.forEach(cap => {
      cap.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [research.captures]);

  return {
    research,
    updateNotes,
    addCapture,
    removeCapture,
    updateCaptureNotes,
    updateCaptureTags,
    assignCaptureToCollection,
    addCollection,
    removeCollection,
    updateCollection,
    clearResearch,
    exportToMarkdown,
    exportToPDF,
    downloadAsJSON,
    getCaptionsByCollection,
    getAllTags,
  };
}

function formatCaptureMarkdown(cap: ResearchCapture, index: number, collection?: ResearchCollection): string {
  let md = `**${index}. ${cap.bookTitle || 'Unknown'}** (Page ${cap.page || '?'})\n`;
  md += `- Captured: ${new Date(cap.timestamp).toLocaleString('en-ZA')}\n`;
  if (cap.notes) {
    md += `- Notes: ${cap.notes}\n`;
  }
  if (cap.tags && cap.tags.length > 0) {
    md += `- Tags: ${cap.tags.join(', ')}\n`;
  }
  if (collection) {
    md += `- Collection: ${collection.name}\n`;
  }
  md += `\n`;
  return md;
}

function downloadAsFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
