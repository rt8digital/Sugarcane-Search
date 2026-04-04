# 🧂 SALT SEARCH ZA — South African Lineage Tracer

**SALT** is a free, open-source historical search engine for South Africa's Indian community. Search across 677+ pages of biographical records from the *Indian Who's Who* directories (1936–1972) to uncover your South African lineage.

> **SALT** = **S**outh **A**frican **L**ineage **T**racer — just like salt preserves food, SALT preserves heritage.

---

## ✨ Features

- **🔍 Deep OCR Search** — Full-text search across 29 PDF volumes with sentence-level context previews
- **⚡ Pre-built Search Index** — Index is generated at build time via Node.js (not client-side), so search is instant
- **📄 PDF Viewer with Page Navigation** — Click any result to jump directly to the exact page in the original document
- **🆓 100% Free** — No ads, no paywalls, no accounts. All processing happens in your browser
- **📡 Offline-Resilient** — Falls back to bundled index if CDN is unavailable
- **🌐 GitHub-Powered Storage** — PDFs and search index are hosted on GitHub (no external storage costs)

## 📚 Archive Volumes

| Era | Volumes | Description |
|-----|---------|-------------|
| **1936–37** | 4 parts | The earliest known edition documenting a pioneering era |
| **1940** | 7 parts | Including trade directories and commercial history |
| **1960** | 9 parts | Comprehensive mid-century archival update |
| **1971–72** | 9 parts | The final and most complete edition |

**Total:** 677+ pages across 29 volumes, graciously provided by the **UKZN Gandhi-Luthuli Documentation Centre**.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                   GitHub Repo                    │
│  ┌──────────────────┐  ┌─────────────────────┐  │
│  │ public/pdfs/     │  │ public/             │  │
│  │  (29 PDF files)  │  │ search-index.json   │  │
│  │  ~350MB total    │  │ (~5MB, pre-built)   │  │
│  └──────────────────┘  └─────────────────────┘  │
└────────┬────────────────────┬────────────────────┘
         │                    │
         ▼                    ▼
┌────────────────┐   ┌──────────────────────────┐
│  media.github  │   │  Client Browser          │
│  usercontent   │   │  ┌────────────────────┐  │
│  (PDF binaries)│   │  │ usePdfIndex()      │  │
│                │   │  │ 1. Try CDN index   │  │
│                │   │  │ 2. Fallback local  │  │
│                │   │  └────────────────────┘  │
└────────────────┘   │  ┌────────────────────┐  │
                     │  │ useSearch()        │  │
                     │  │ Fuse.js fuzzy      │  │
                     │  └────────────────────┘  │
                     │  ┌────────────────────┐  │
                     │  │ PdfViewer.tsx      │  │
                     │  │ PDF.js viewer      │  │
                     │  └────────────────────┘  │
                     └──────────────────────────┘
```

### Adding New Volumes

When new PDFs are discovered or donated:

1. **Add PDFs to GitHub** — Upload to `public/pdfs/` in your repo
2. **Place PDFs locally** — Copy to `public/pdfs/` in this project
3. **Update `scripts/build-index.ts`** — Add the new volume to the `BOOKS` array
4. **Update `src/App.tsx`** — Add the new volume to the `BOOKS` export
5. **Rebuild the index** — Run `npm run build-index`
6. **Push to GitHub** — Commit and push `public/search-index.json` + new PDFs

```bash
# Build the search index (runs locally, takes ~30s)
npm run build-index

# Push updated index + PDFs to GitHub CDN
# (copy public/search-index.json and PDFs to your GitHub repo, then commit)
```

## 🛠️ Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Rebuild search index (after adding new PDFs)
npm run build-index
```

## 💛 Support This Project

SALT is a passion project built on the belief that everyone should have access to their history. If you'd like to support:

- **📧 Email:** ilyas@rt8.co.za
- **💬 WhatsApp:** [Message us](https://wa.me/27847990432)
- **💳 Banking Details:**
  - **Account Holder:** Ilyas Shamoon
  - **Bank:** FNB (First National Bank)
  - **Account Number:** 62477519840
  - **Branch Code:** 250655
  - **E Wallet:** 0847990432
- **🌐 PayPal:** [paypal.me/a7rium](https://paypal.me/a7rium)

We also welcome donations of old books, documents, photos, and historical data that could help others connect with their heritage.

## 📜 Credits

- Original documents graciously provided by the **UKZN Gandhi-Luthuli Documentation Centre**
- **Created by [Rotate Group (Pty) Ltd](https://rt8.co.za)**
- Lead Developer: Ilyas Shamoon

---

*Dedicated to the preservation of South African Indian history.* 🧂
