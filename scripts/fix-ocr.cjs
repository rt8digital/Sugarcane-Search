const fs = require('fs');
const path = require('path');

const INDEX_DIR = path.join(__dirname, '..', 'public', 'indexes');

const corrections = [
  // Word splits (OCR puts space before capital letters)
  { pattern: /toSouth/g, replacement: 'to South' },
  { pattern: /inPretoria/g, replacement: 'in Pretoria' },
  { pattern: /inDurban/g, replacement: 'in Durban' },
  { pattern: /inNatal/g, replacement: 'in Natal' },
  { pattern: /inTransvaal/g, replacement: 'in Transvaal' },
  { pattern: /ofDurban/g, replacement: 'of Durban' },
  { pattern: /ofPretoria/g, replacement: 'of Pretoria' },
  { pattern: /ofJohannesburg/g, replacement: 'of Johannesburg' },
  { pattern: /inJohannesburg/g, replacement: 'in Johannesburg' },
  { pattern: /ofCape/g, replacement: 'of Cape' },
  { pattern: /ofIndia/g, replacement: 'of India' },
  { pattern: /inIndia/g, replacement: 'in India' },
  { pattern: /ofNatal/g, replacement: 'of Natal' },
  { pattern: /ofTransvaal/g, replacement: 'of Transvaal' },
  { pattern: /inCape/g, replacement: 'in Cape' },
  { pattern: /ofPort/g, replacement: 'of Port' },
  { pattern: /ofEast/g, replacement: 'of East' },
  
  // Organization fixes
  { pattern: /T\.1\.C\./g, replacement: 'T.L.C.' },
  { pattern: /T\.1\.C(?!\.)/g, replacement: 'T.L.C.' },
  { pattern: /S\.A\.LC/g, replacement: 'S.A.L.C' },
  { pattern: /S\.A\.L\.C/g, replacement: 'S.A.L.C' },
  { pattern: /S\.A\.I(?!\.)/g, replacement: 'S.A.I.' },
  { pattern: /N\.I\.C(?!\.)/g, replacement: 'N.I.C.' },
  { pattern: /H\.Y\.M(?!\.)/g, replacement: 'H.Y.M.' },
  { pattern: /T\.I\.C(?!\.)/g, replacement: 'T.I.C.' },
  { pattern: /P\.M\.B(?!\.)/g, replacement: 'P.M.B.' },
  { pattern: /N\.I\.F(?!\.)/g, replacement: 'N.I.F.' },
  { pattern: /K\.R\.D(?!\.)/g, replacement: 'K.R.D.' },
  { pattern: /S\.A\.R(?!\.)/g, replacement: 'S.A.R.' },
  { pattern: /Y\.M\.C\.A(?!\.)/g, replacement: 'Y.M.C.A.' },
  { pattern: /T\.L\.C(?!\.)/g, replacement: 'T.L.C.' },
  { pattern: /G\.P\.O/g, replacement: 'G.P.O.' },
  { pattern: /M\.L\.A(?!\.)/g, replacement: 'M.L.A.' },
  { pattern: /C\.O\.D/g, replacement: 'C.O.D.' },
  { pattern: /R\.A\.F/g, replacement: 'R.A.F.' },
  
  // Word fixes
  { pattern: /memher/g, replacement: 'member' },
  { pattern: /in-/g, replacement: '' },
  { pattern: /the-/g, replacement: 'the' },
  { pattern: /with-/g, replacement: 'with' },
  { pattern: /has-/g, replacement: 'has' },
  { pattern: /was-/g, replacement: 'was' },
  { pattern: /were-/g, replacement: 'were' },
  
  // Already fixed patterns (maintain)
  { pattern: /S\.Alrica/g, replacement: 'South Africa' },
  { pattern: /thereeversince/g, replacement: 'there ever since' },
  { pattern: /aflecting/g, replacement: 'affecting' },
  { pattern: /mefchant/g, replacement: 'merchant' },
  { pattern: /seccty\./g, replacement: 'sec.' },
  { pattern: /secty\./g, replacement: 'sec.' },
  { pattern: /Public activitics/g, replacement: 'Public activities' },
  { pattern: /Publi¢ activities/g, replacement: 'Public activities' },
  { pattern: /recreatlon/g, replacement: 'recreation' },
  { pattern: /intercsted/g, replacement: 'interested' },
  { pattern: /membcr/g, replacement: 'member' },
  { pattern: /Koad/g, replacement: 'Road' },
  { pattern: /Tel\. ad\./g, replacement: 'Tel. ad' },
  { pattern: /G\.1\.E\./g, replacement: 'G.I.E.' },
  { pattern: /v\.-presdt\./g, replacement: 'v.-pres.' },
  
  // Extra spacing
  { pattern: /  +/g, replacement: ' ' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;
  
  for (const { pattern, replacement } of corrections) {
    const matches = content.match(pattern);
    if (matches) {
      content = content.replace(pattern, replacement);
      changes += matches.length;
    }
  }
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  Fixed ${changes} errors in ${path.basename(filePath)}`);
  }
}

const files = fs.readdirSync(INDEX_DIR).filter(f => f.endsWith('.json'));

console.log(`Processing ${files.length} index files...\n`);

for (const file of files) {
  const filePath = path.join(INDEX_DIR, file);
  processFile(filePath);
}

console.log('\nDone!');