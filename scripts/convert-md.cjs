const fs = require('fs');
const path = require('path');

const TEXT_DIR = path.join(__dirname, '..', 'public', 'text');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'indexes');

const ocrCorrections = [
  { pattern: /S\.Alrica/g, replacement: 'South Africa' },
  { pattern: /toSouth/g, replacement: 'to South' },
  { pattern: /inPretoria/g, replacement: 'in Pretoria' },
  { pattern: /inDurban/g, replacement: 'in Durban' },
  { pattern: /inNatal/g, replacement: 'in Natal' },
  { pattern: /inTransvaal/g, replacement: 'in Transvaal' },
  { pattern: /ofDurban/g, replacement: 'of Durban' },
  { pattern: /ofPretoria/g, replacement: 'of Pretoria' },
  { pattern: /ofIndia/g, replacement: 'of India' },
  { pattern: /ofNatal/g, replacement: 'of Natal' },
  { pattern: /ofTransvaal/g, replacement: 'of Transvaal' },
  { pattern: /thereeversince/g, replacement: 'there ever since' },
  { pattern: /thereever since/g, replacement: 'there ever since' },
  { pattern: /mefchant/g, replacement: 'merchant' },
  { pattern: /Koad/g, replacement: 'Road' },
  { pattern: /memher/g, replacement: 'member' },
  { pattern: /membcr/g, replacement: 'member' },
  { pattern: /secty\./g, replacement: 'sec.' },
  { pattern: /seccty\./g, replacement: 'sec.' },
  { pattern: /secrety\./g, replacement: 'sec.' },
  { pattern: /T\.1\.C\./g, replacement: 'T.L.C.' },
  { pattern: /T\.1\.C(?!\.)/g, replacement: 'T.L.C.' },
  { pattern: /S\.A\.L\.C/g, replacement: 'S.A.L.C' },
  { pattern: /S\.A\.LC/g, replacement: 'S.A.L.C' },
  { pattern: /S\.A\.I\.C/g, replacement: 'S.A.I.C' },
  { pattern: /S\.A\.1\.C/g, replacement: 'S.A.I.C' },
  { pattern: /N\.I\.C(?!\.)/g, replacement: 'N.I.C.' },
  { pattern: /N\.I\.L\.C/g, replacement: 'N.I.L.C' },
  { pattern: /Public activitics/g, replacement: 'Public activities' },
  { pattern: /Public activites/g, replacement: 'Public activities' },
  { pattern: /Public activitxs/g, replacement: 'Public activities' },
  { pattern: /Public act\./g, replacement: 'Public activities' },
  { pattern: /Public actiuitr/g, replacement: 'Public activities' },
  { pattern: /Public actvities/g, replacement: 'Public activities' },
  { pattern: /Public actties/g, replacement: 'Public activities' },
  { pattern: /Public ac-/g, replacement: 'Public activities' },
  { pattern: /recreatlon/g, replacement: 'recreation' },
  { pattern: /Recreation:/g, replacement: 'Recreation:' },
  { pattern: /intercsted/g, replacement: 'interested' },
  { pattern: /inter-ested/g, replacement: 'interested' },
  { pattern: /G\.1\.E\./g, replacement: 'G.I.E.' },
  { pattern: /v\.-presdt\./g, replacement: 'vice-pres.' },
  { pattern: /v\.-pres\./g, replacement: 'vice-pres.' },
  { pattern: /o\. s\. of/g, replacement: 's. of' },
  { pattern: /e\. s\. of/g, replacement: 's. of' },
  { pattern: /s\.of late/g, replacement: 's. of late' },
  { pattern: /c\.s\.of/g, replacement: 's. of' },
  { pattern: /¢\. s\./g, replacement: 's.' },
  { pattern: /educ\./g, replacement: 'educ.' },
  { pattern: /educ\. /g, replacement: 'educ. ' },
  { pattern: /b\./g, replacement: 'b.' },
  { pattern: /m\./g, replacement: 'm.' },
  { pattern: /educ\.educ\./g, replacement: 'educ.' },
  { pattern: /Address/g, replacement: 'Address' },
  { pattern: /Addyvess/g, replacement: 'Address' },
  { pattern: /lddress/g, replacement: 'Address' },
  { pattern: /Addvess/g, replacement: 'Address' },
  { pattern: /Adddess/g, replacement: 'Address' },
  { pattern: /wlddyess/g, replacement: 'Address' },
  { pattern: /Tel\. ad\./g, replacement: 'Tel. ad' },
  { pattern: /Tel\. ad,/, replacement: 'Tel. ad,' },
  { pattern: /in-/g, replacement: '' },
  { pattern: /was-/g, replacement: 'was' },
  { pattern: /has-/g, replacement: 'has' },
  { pattern: /with-/g, replacement: 'with' },
  { pattern: /the-/g, replacement: 'the' },
  { pattern: /&amp;/g, replacement: '&' },
  { pattern: /&lsquo;/g, replacement: "'" },
  { pattern: /&rsquo;/g, replacement: "'" },
  { pattern: /&mdash;/g, replacement: '—' },
  { pattern: /  +/g, replacement: ' ' },
  { pattern: /,\./g, replacement: ',' },
  { pattern: /\.\./g, replacement: '.' },
  { pattern: /,,/g, replacement: ',' },
  { pattern: /——/g, replacement: '—' },
];

function applyCorrections(text) {
  let result = text;
  for (const { pattern, replacement } of ocrCorrections) {
    result = result.replace(pattern, replacement);
  }
  return result;
}

function parseBiographies(text) {
  const records = [];
  
  const blocks = text.split(/\n(?=[A-Z][A-Z\s]{2,})/);
  
  for (const block of blocks) {
    const trimmed = block.trim();
    if (trimmed.length < 15) continue;
    
    const nameMatch = trimmed.match(/^([A-Z][A-Za-z\s'-]+)(?:,|;|\s+[A-Z])/);
    if (!nameMatch) continue;
    
    const fullName = nameMatch[1].trim().replace(/\s+/g, ' ');
    if (fullName.length < 3) continue;
    
    records.push({
      fullName,
      rawText: trimmed
    });
  }
  
  return records;
}

function parseMdFile(mdContent, bookId, title) {
  const lines = mdContent.split('\n');
  
  let totalPages = 0;
  const pages = [];
  let currentPage = null;
  let pageContent = [];
  let inPageSection = false;
  
  const titleMatch = mdContent.match(/\*\*Total Pages:\*\*\s*(\d+)/);
  if (titleMatch) {
    totalPages = parseInt(titleMatch[1]);
  }
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.startsWith('## Page ')) {
      if (currentPage !== null && pageContent.length > 0) {
        const text = applyCorrections(pageContent.join(' ').replace(/\s+/g, ' ').trim());
        const records = parseBiographies(text);
        pages.push({
          page: currentPage,
          text: text,
          records: records
        });
      }
      
      const pageNumMatch = trimmed.match(/##\s+Page\s+(\d+)/);
      currentPage = pageNumMatch ? parseInt(pageNumMatch[1]) : currentPage;
      pageContent = [];
      inPageSection = true;
    } else if (inPageSection && currentPage !== null) {
      if (!trimmed.startsWith('#') && !trimmed.startsWith('**') && trimmed !== '---') {
        pageContent.push(trimmed);
      }
    }
  }
  
  if (currentPage !== null && pageContent.length > 0) {
    const text = applyCorrections(pageContent.join(' ').replace(/\s+/g, ' ').trim());
    const records = parseBiographies(text);
    pages.push({
      page: currentPage,
      text: text,
      records: records
    });
  }
  
  return {
    bookId,
    title,
    totalPages: totalPages || pages.length,
    indexedAt: new Date().toISOString(),
    pages
  };
}

function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(TEXT_DIR).filter(f => f.endsWith('.md'));

  console.log(`Processing ${files.length} MD files...\n`);

  let processed = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const bookId = file.replace('.md', '');
      const mdContent = fs.readFileSync(path.join(TEXT_DIR, file), 'utf8');
      
      const titleMatch = mdContent.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : bookId;
      
      const index = parseMdFile(mdContent, bookId, title);
      
      const outPath = path.join(OUTPUT_DIR, `${bookId}.json`);
      fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
      
      console.log(`✓ ${bookId}: ${index.pages.length} pages, ${index.pages.reduce((sum, p) => sum + (p.records?.length || 0), 0)} records`);
      processed++;
    } catch (e) {
      console.error(`✗ Failed: ${file} - ${e.message}`);
      failed++;
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Processed: ${processed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main();