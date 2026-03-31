import { BiographicalRecord } from '../types/schema';

/**
 * Heuristic parser for extracting biographical records from OCR text.
 * Strategy: Look for capitalized names followed by a colon or a specific 
 * biographical pattern like "b. <date>".
 */
export function parseBiographies(text: string): BiographicalRecord[] {
  const records: BiographicalRecord[] = [];
  
  // Split text into potential sections (entries often start on new lines or after certain patterns)
  // This is a naive split by capitalization + colon as a marker for a new entry
  const entryMarkers = text.split(/(?=[A-Z]{2,},?\s[A-Z]{2,}:)/g);
  
  for (let segment of entryMarkers) {
    if (!segment.trim()) continue;
    
    const record: BiographicalRecord = {
      fullName: '',
      rawText: segment.trim()
    };
    
    // 1. Extract Name (Look for "NAME, FABIAN:")
    const nameMatch = segment.match(/^([A-Z\s,]{3,}):/);
    if (nameMatch) {
      record.fullName = nameMatch[1].trim();
      segment = segment.substring(nameMatch[0].length).trim();
    } else {
      // Fallback: use first few words if it looks like a name
      const words = segment.split(' ');
      if (words[0] && words[0] === words[0].toUpperCase()) {
         record.fullName = words.slice(0, 2).join(' ').replace(':', '');
      }
    }
    
    if (!record.fullName) continue;

    // 2. Extract Profession (Text until the first "b." or period)
    const profMatch = segment.match(/^([^.]+?)\.[\s]b\./i);
    if (profMatch) {
      record.profession = profMatch[1].trim();
    } else {
      const sentence = segment.split('.')[0];
      if (sentence && sentence.length < 100) {
        record.profession = sentence.trim();
      }
    }

    // 3. Extract Birth Date (Look for "b. <date>")
    const birthMatch = segment.match(/b\.\s?([\d]{1,2}[a-z\s]{0,10}[\d]{4}|[\d]{4}|[\d]{1,2}\s[a-z]{3,}\s[\d]{4})/i);
    if (birthMatch) {
      record.birthDate = birthMatch[1].trim();
    }

    records.push(record);
  }
  
  return records;
}
