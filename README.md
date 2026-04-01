# 🌿 South African Lineage Tracer (SALT)

**Modern Heritage Archive Discovery** – A high-performance, modular search engine for South Africa's Indian community biographical records. SALT provides an elegant, scalable interface for traversing history across decades of digitised volumes.

![SALT Logo](./public/SALT.svg)

---

## ✨ Features

- **🏆 Heritage Glassmorphism UI** – A premium, state-of-the-art design system featuring depth, vibrant accents, and smooth animations.
- **🚀 Scalable Virtualization** – Powered by `react-window`, the results feed remains buttery smooth even with thousands of matches across hundreds of volumes.
- **⚡ Smart Delta Indexing** – Intelligent client-side indexing that only processes new volumes, preserving your local cache (IndexedDB) for near-instant subsequent loads.
- **🗺️ Narrative Navigation** – Seamless page transitions using `framer-motion` for a cinematic research experience.
- **🔍 Deep OCR Search** – Full-text fuzzy search across scanned documents with on-the-fly highlighting in a custom high-performance PDF viewer.

## 🏗️ Architecture

The system is built for extreme modularity, allowing new PDF volumes to be dropped into the registry without re-indexing the entire archive.

```bash
src/
├── components/       # Premium UI components
│   ├── PageTransition.tsx # Framer Motion route wrapper
│   ├── PdfViewer.tsx    # Glassmorphism PDF explorer
│   ├── ResultCard.tsx   # Depth-aware match cards
│   └── AboutPage.tsx    # Narrative history view
├── hooks/            # Modern React logic
│   ├── usePdfIndex.ts   # Smart Delta Indexing engine
│   ├── useSearch.ts     # Multi-threaded search logic
│   └── useSearchHistory.ts # Persistent search persistence
├── workers/          # Background compute
│   └── search.worker.ts # High-perf Fuse.js search thread
├── data/
│   └── books.ts         # Central Volume Registry
└── styles/           # Design System
    └── index.css        # Heritage Glassmorphism tokens
```

### 🧠 Core Systems

#### 1. Smart Delta Indexing (`usePdfIndex.ts`)
Avoids redundant processing by comparing the Volume Registry with the local IndexedDB cache. Only new or modified PDFs are indexed using PDF.js text extraction.

#### 2. Virtualized Feed (`App.tsx`)
By flattening hierarchical results (Book > Page > Record) into a single virtualized list, we maintain 60FPS scrolling regardless of results count.

#### 3. Memory Management
Web workers are utilized for heavy search lifting, and PDF document proxies are cleaned up after extraction to maintain a small memory footprint during long research sessions.

## 🛠️ Getting Started

```bash
# 1. Install modern dependencies
npm install

# 2. Repair vulnerabilities (Secure standard)
npm audit fix --force

# 3. Launch development environment
npm run dev
```

### 📂 Porting New Archives
To add new volumes, simply update `src/data/books.ts`. The **Smart Delta** engine will automatically detect and index the new files on the next user visit.

```typescript
// Example registry entry
{
  id: 'WhosWho_1960_Vol4',
  title: 'Indian Who\'s Who 1960',
  year: '1960',
  pdfPath: '/pdfs/Vol4_1960_ocr.pdf',
}
```

## 📜 Credits & License

SALT is a collaborative effort to preserve community heritage.
Original documents courtesy of the **UKZN Gandhi-Luthuli Documentation Centre**.

**Created by [Rotate Group (Pty) Ltd](https://rt8.co.za)**
- Lead Developer: Ilyas Shamoon
- Design Language: Heritage Glassmorphism v2.3

---
*Dedicated to the preservation of South African Indian history.*
