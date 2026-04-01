import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  FileText,
  Image as ImageIcon,
  Plus,
  FolderPlus,
  ChevronDown,
  ChevronRight,
  Edit2,
  FileJson,
  Printer,
  Copy,
  Hash,
  X as XIcon,
} from 'lucide-react';
import { useResearch, ResearchCollection } from '../hooks/useResearch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

interface ResearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

type ActiveView = 'all' | 'collection' | 'tag';

export function ResearchPanel({ isOpen, onClose }: ResearchPanelProps) {
  const {
    research,
    updateNotes,
    removeCapture,
    updateCaptureNotes,
    updateCaptureTags,
    assignCaptureToCollection,
    addCollection,
    removeCollection,
    clearResearch,
    exportToMarkdown,
    exportToPDF,
    downloadAsJSON,
    getAllTags,
  } = useResearch();

  const [activeView, setActiveView] = useState<ActiveView>('all');
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set());

  const allTags = getAllTags();

  const filteredCaptures = useMemo(() => {
    let captures = research.captures;
    if (activeView === 'collection' && selectedCollection) {
      captures = captures.filter((c) => c.collectionId === selectedCollection);
    } else if (activeView === 'tag' && selectedTag) {
      captures = captures.filter((c) => c.tags?.includes(selectedTag));
    }
    return captures.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [research.captures, activeView, selectedCollection, selectedTag]);

  const handleToggleCollectionExpand = (collectionId: string) => {
    setExpandedCollections((prev) => {
      const next = new Set(prev);
      if (next.has(collectionId)) {
        next.delete(collectionId);
      } else {
        next.add(collectionId);
      }
      return next;
    });
  };

  const handleCreateCollection = () => {
    if (newCollectionName.trim()) {
      addCollection(newCollectionName.trim());
      setNewCollectionName('');
      setShowNewCollection(false);
    }
  };

  const handleAddTag = (captureId: string, tag: string) => {
    const capture = research.captures.find((c) => c.id === captureId);
    if (capture && !capture.tags?.includes(tag)) {
      updateCaptureTags(captureId, [...(capture.tags || []), tag.trim()]);
    }
  };

  const handleRemoveTag = (captureId: string, tag: string) => {
    const capture = research.captures.find((c) => c.id === captureId);
    if (capture) {
      updateCaptureTags(captureId, capture.tags?.filter((t) => t !== tag) || []);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[199] bg-foreground/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 z-[200] w-full max-w-lg bg-background border-l border-border shadow-2xl flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-label="Research Panel"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-lg">
                  <Search size={20} strokeWidth={2} className="text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground font-display">
                    Research Panel
                  </h2>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mt-0.5">
                    {research.captures.length} item
                    {research.captures.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10"
                aria-label="Close panel"
              >
                <XIcon size={20} strokeWidth={2} className="text-muted-foreground" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin">
              {/* Notes Section */}
              <section className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <FileText size={16} strokeWidth={2} />
                  Research Notes
                </label>
                <Textarea
                  className="w-full min-h-[120px] font-lora resize-y text-sm px-4 py-3"
                  placeholder="Record your findings, family connections, or cross-references..."
                  value={research.notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  aria-label="Research notes"
                />
              </section>

              {/* Collections Section */}
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <FolderPlus size={16} strokeWidth={2} />
                    Collections
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNewCollection(!showNewCollection)}
                    className="text-xs uppercase tracking-wider"
                  >
                    <Plus size={16} strokeWidth={2} />
                    New
                  </Button>
                </div>

                {showNewCollection && (
                  <motion.div
                    className="flex gap-2 p-3 bg-muted rounded-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Input
                      className="flex-1 text-sm px-3 py-2"
                      placeholder="Collection name..."
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleCreateCollection()
                      }
                      autoFocus
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleCreateCollection}
                    >
                      Add
                    </Button>
                    <Button
                      variant="ghost"
                      size="iconSm"
                      onClick={() => setShowNewCollection(false)}
                    >
                      <XIcon size={18} strokeWidth={2} />
                    </Button>
                  </motion.div>
                )}

                {research.collections.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic py-4 text-center bg-muted/50 rounded-lg">
                    No collections yet. Create one to organize your captures.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {research.collections.map((col) => {
                      const count = research.captures.filter(
                        (c) => c.collectionId === col.id
                      ).length;
                      const isExpanded = expandedCollections.has(col.id);

                      return (
                        <div key={col.id} className="group">
                          <button
                            onClick={() => handleToggleCollectionExpand(col.id)}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/60 transition-all duration-200 text-left border border-transparent hover:border-border"
                          >
                            {isExpanded ? (
                              <ChevronDown
                                size={16}
                                strokeWidth={2}
                                className="text-muted-foreground"
                              />
                            ) : (
                              <ChevronRight
                                size={16}
                                strokeWidth={2}
                                className="text-muted-foreground"
                              />
                            )}
                            <div
                              className="w-3.5 h-3.5 rounded-md shrink-0"
                              style={{ backgroundColor: col.color }}
                            />
                            <span className="flex-1 text-sm font-bold text-foreground truncate">
                              {col.name}
                            </span>
                            <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1.5 rounded-md min-w-[2.5rem] text-center">
                              {count}
                            </span>
                            <Button
                              variant="ghost"
                              size="iconSm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCollection(col.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 hover:bg-accent/10 hover:text-accent"
                              aria-label={`Delete collection ${col.name}`}
                            >
                              <Trash2 size={14} strokeWidth={2} />
                            </Button>
                          </button>

                          {isExpanded && (
                            <motion.div
                              className="ml-10 mt-2 space-y-2"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                            >
                              {research.captures
                                .filter((c) => c.collectionId === col.id)
                                .map((cap) => (
                                  <CaptureCard
                                    key={cap.id}
                                    capture={cap}
                                    collections={research.collections}
                                    onRemove={removeCapture}
                                    onUpdateNotes={updateCaptureNotes}
                                    onAssignCollection={assignCaptureToCollection}
                                    onAddTag={handleAddTag}
                                    onRemoveTag={handleRemoveTag}
                                    allTags={allTags}
                                  />
                                ))}
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Captures Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <ImageIcon size={16} strokeWidth={2} />
                    {activeView === 'all'
                      ? 'All Captures'
                      : activeView === 'collection'
                      ? 'By Collection'
                      : 'By Tag'}
                  </label>

                  {/* Filter tabs */}
                  <div className="flex gap-1.5">
                    {(['all', 'collection', 'tag'] as const).map((view) => (
                      <Button
                        key={view}
                        variant={activeView === view ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => {
                          setActiveView(view);
                          if (view !== 'collection') setSelectedCollection(null);
                          if (view !== 'tag') setSelectedTag(null);
                        }}
                        className="text-xs uppercase tracking-wider px-4 py-2 h-auto"
                      >
                        {view}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Collection filter */}
                {activeView === 'collection' && (
                  <div className="flex flex-wrap gap-2">
                    {research.collections.map((col) => (
                      <Button
                        key={col.id}
                        variant={selectedCollection === col.id ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() =>
                          setSelectedCollection(
                            selectedCollection === col.id ? null : col.id
                          )
                        }
                        className="text-xs px-3 py-1.5 h-auto flex items-center gap-2"
                      >
                        <div
                          className="w-2 h-2 rounded-sm"
                          style={{ backgroundColor: col.color }}
                        />
                        {col.name}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Tag filter */}
                {activeView === 'tag' && (
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() =>
                          setSelectedTag(selectedTag === tag ? null : tag)
                        }
                        className="text-xs px-3 py-1.5 h-auto flex items-center gap-1.5"
                      >
                        <Hash size={10} strokeWidth={2} />
                        {tag}
                      </Button>
                    ))}
                  </div>
                )}

                {/* Captures grid */}
                {filteredCaptures.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-lg text-muted-foreground/60 text-center space-y-2">
                    <ImageIcon
                      size={28}
                      strokeWidth={2}
                      className="opacity-30"
                    />
                    <p className="text-sm font-medium">No captures to display</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {filteredCaptures.map((cap) => (
                      <CaptureCard
                        key={cap.id}
                        capture={cap}
                        collections={research.collections}
                        onRemove={removeCapture}
                        onUpdateNotes={updateCaptureNotes}
                        onAssignCollection={assignCaptureToCollection}
                        onAddTag={handleAddTag}
                        onRemoveTag={handleRemoveTag}
                        allTags={allTags}
                        compact
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-border bg-card/80 backdrop-blur-sm shrink-0">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={exportToMarkdown}
                  className="text-sm justify-center"
                >
                  <Copy size={16} strokeWidth={2} />
                  Markdown
                </Button>
                <Button
                  variant="outline"
                  size="default"
                  onClick={exportToPDF}
                  className="text-sm justify-center"
                >
                  <Printer size={16} strokeWidth={2} />
                  PDF
                </Button>
              </div>
              <Button
                variant="ghost"
                size="default"
                onClick={downloadAsJSON}
                className="w-full text-sm justify-center mb-2"
              >
                <FileJson size={16} strokeWidth={2} />
                Export JSON
              </Button>
              <Button
                variant="destructive"
                size="default"
                onClick={clearResearch}
                className="w-full text-sm justify-center"
              >
                <Trash2 size={16} strokeWidth={2} />
                Clear All Research
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Capture Card Component
interface CaptureCardProps {
  capture: any;
  collections: ResearchCollection[];
  onRemove: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onAssignCollection: (captureId: string, collectionId: string | null) => void;
  onAddTag: (captureId: string, tag: string) => void;
  onRemoveTag: (captureId: string, tag: string) => void;
  allTags: string[];
  compact?: boolean;
}

function CaptureCard({
  capture,
  collections,
  onRemove,
  onUpdateNotes,
  onAssignCollection,
  onAddTag,
  onRemoveTag,
  allTags,
  compact = false,
}: CaptureCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(capture.notes || '');
  const [tagInput, setTagInput] = useState('');

  const handleSaveNotes = () => {
    onUpdateNotes(capture.id, notes);
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      onAddTag(capture.id, tagInput.trim());
      setTagInput('');
    }
  };

  const currentCollection = collections.find((c) => c.id === capture.collectionId);

  return (
    <div
      className={cn(
        'group relative rounded-lg border-2 border-border overflow-hidden bg-card shadow-sm hover:shadow-md transition-all duration-200',
        compact ? '' : 'col-span-2'
      )}
    >
      {/* Image */}
      <div className="relative aspect-video bg-muted">
        <img
          src={capture.image}
          alt="PDF capture"
          className="w-full h-full object-cover"
        />
        {currentCollection && (
          <div
            className="absolute top-2 left-2 px-3 py-1.5 rounded-md text-xs font-bold text-primary-foreground uppercase tracking-wider shadow-md"
            style={{ backgroundColor: currentCollection.color }}
          >
            {currentCollection.name}
          </div>
        )}
        <Button
          variant="destructive"
          size="iconSm"
          onClick={() => onRemove(capture.id)}
          className="absolute top-2 right-2 bg-card/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all h-9 w-9"
          aria-label="Delete capture"
        >
          <Trash2 size={14} strokeWidth={2} />
        </Button>
      </div>

      {/* Info */}
      <div className="p-3.5 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {capture.bookTitle}
            </p>
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              Page {capture.page} •{' '}
              {new Date(capture.timestamp).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Tags */}
        {capture.tags && capture.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {capture.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-muted text-muted-foreground text-[10px] font-bold rounded-md"
              >
                <Hash size={10} strokeWidth={2} />
                {tag}
                <button
                  onClick={() => onRemoveTag(capture.id, tag)}
                  className="hover:text-accent transition-colors p-0.5"
                  aria-label={`Remove tag ${tag}`}
                >
                  <XIcon size={10} strokeWidth={2} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add tag input */}
        <div className="flex items-center gap-2">
          <Input
            className="flex-1 text-xs h-9 px-3 py-2"
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
          />
          <Button
            variant="primary"
            size="iconSm"
            onClick={handleAddTag}
            className="h-9 w-9"
          >
            <Plus size={14} strokeWidth={2} />
          </Button>
        </div>

        {/* Notes */}
        {isEditing ? (
          <div className="space-y-2">
            <Textarea
              className="w-full min-h-[70px] px-3 py-2.5 text-xs resize-none h-auto"
              placeholder="Add notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveNotes}
                className="flex-1"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="w-full text-xs justify-start px-3 py-2"
          >
            <Edit2 size={14} strokeWidth={2} />
            {capture.notes ? 'Edit notes' : 'Add notes'}
          </Button>
        )}

        {/* Collection assign */}
        <select
          className="w-full px-3 py-2.5 text-xs rounded-lg border-2 border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary h-9 font-medium"
          value={capture.collectionId || ''}
          onChange={(e) => onAssignCollection(capture.id, e.target.value || null)}
        >
          <option value="">No collection</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
