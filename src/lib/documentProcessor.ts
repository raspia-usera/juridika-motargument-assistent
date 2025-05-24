import mammoth from 'mammoth';
import { pdfjs } from 'react-pdf';
import { supabase } from './supabase';
import { extractDocumentContent, getSessionId } from './supabase';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Enhanced file validation with expanded format support
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const supportedTypes = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/rtf',
    'application/vnd.oasis.opendocument.text', // ODT
    'text/html',
    'text/plain',
    'text/markdown',
    // Images for OCR
    'image/jpeg',
    'image/png',
    'image/heic',
    'image/webp',
    'image/bmp',
    'image/tiff',
    'image/gif'
  ];

  if (!file) {
    return { isValid: false, error: 'Ingen fil vald' };
  }

  if (file.size === 0) {
    return { isValid: false, error: 'Filen är tom. Välj en fil med innehåll.' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'Filen är för stor. Maximal storlek är 50MB.' };
  }

  if (!supportedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Filformat stöds inte. Accepterade format: PDF, Word, RTF, Text och mer' 
    };
  }

  // Check for problematic filename characters
  const problematicChars = /[<>:"|?*]/;
  if (problematicChars.test(file.name)) {
    return { 
      isValid: false, 
      error: 'Filnamnet innehåller ogiltiga tecken. Undvik < > : " | ? *' 
    };
  }

  return { isValid: true };
};

// Upload document with enhanced error handling
export const uploadDocument = async (file: File): Promise<string | null> => {
  try {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.isValid) {
      console.error('File validation failed:', validation.error);
      throw new Error(validation.error);
    }

    const sessionId = await getSessionId();
    if (!sessionId) {
      throw new Error('Kunde inte skapa session. Försök ladda om sidan.');
    }
    
    console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Sanitize filename for storage
    const sanitizedName = file.name.replace(/[<>:"|?*]/g, '_');
    const filePath = `${sessionId}/${Date.now()}_${sanitizedName}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Kunde inte ladda upp filen till lagring. Försök igen.');
    }

    console.log('File uploaded to storage successfully:', filePath);

    // Create document record
    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        session_id: sessionId,
        filename: file.name,
        mimetype: file.type,
        storage_path: filePath,
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Kunde inte spara dokumentinformation. Försök igen.');
    }
    
    const documentId = data?.id;
    if (!documentId) {
      throw new Error('Inget dokument-ID returnerades från databasen.');
    }

    console.log('Document record created with ID:', documentId);
    
    // Process document to extract text
    await processDocument(file, documentId);
    
    console.log('Document processed successfully:', documentId);
    return documentId;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
};

// Create document from OCR text
export const createDocumentFromText = async (text: string, filename: string): Promise<string | null> => {
  try {
    const sessionId = await getSessionId();
    if (!sessionId) {
      throw new Error('Kunde inte skapa session. Försök ladda om sidan.');
    }
    
    console.log('Creating document from OCR text:', filename);
    
    // Create text file blob
    const textBlob = new Blob([text], { type: 'text/plain' });
    const sanitizedName = filename.replace(/[<>:"|?*]/g, '_');
    const filePath = `${sessionId}/${Date.now()}_${sanitizedName}`;
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, textBlob);
      
    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Kunde inte ladda upp den extraherade texten. Försök igen.');
    }

    // Create document record
    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        session_id: sessionId,
        filename: filename,
        mimetype: 'text/plain',
        storage_path: filePath,
        content: text
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error('Kunde inte spara dokumentinformation. Försök igen.');
    }
    
    const documentId = data?.id;
    console.log('OCR document created with ID:', documentId);
    return documentId;
  } catch (error) {
    console.error('Error creating document from text:', error);
    return null;
  }
};

// Enhanced document processing with expanded format support
export const processDocument = async (file: File, documentId: string): Promise<boolean> => {
  try {
    const fileType = file.type;
    let text = '';
    
    console.log('Processing document:', file.name, 'Type:', fileType);
    
    // Extract text based on file type
    if (fileType === 'application/pdf') {
      text = await extractPdfText(file);
    } else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await extractWordText(file);
    } else if (fileType === 'application/rtf') {
      text = await extractRtfText(file);
    } else if (fileType === 'application/vnd.oasis.opendocument.text') {
      text = await extractOdtText(file);
    } else if (fileType === 'text/html') {
      text = await extractHtmlText(file);
    } else if (fileType === 'text/plain' || fileType === 'text/markdown') {
      text = await file.text();
    } else if (fileType.startsWith('image/')) {
      // For images, we'll skip processing here as OCR should handle them separately
      text = '[Bildfil - använd OCR-funktionen för textextrahering]';
    } else {
      throw new Error('Filtypen stöds inte för textextrahering');
    }
    
    if (!text.trim()) {
      console.warn('No text extracted from document:', file.name);
      text = '[Ingen text kunde extraheras från detta dokument]';
    }
    
    console.log('Text extracted, length:', text.length);
    
    // Update document with extracted content
    const success = await extractDocumentContent(documentId, text);
    if (!success) {
      throw new Error('Kunde inte spara extraherad text');
    }
    
    return true;
  } catch (error) {
    console.error('Error processing document:', error);
    
    // Try to save error information
    try {
      await extractDocumentContent(documentId, `[Fel vid textextrahering: ${error instanceof Error ? error.message : 'Okänt fel'}]`);
    } catch (saveError) {
      console.error('Could not save error information:', saveError);
    }
    
    return false;
  }
};

// Enhanced PDF text extraction with better error handling
const extractPdfText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let text = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        text += pageText + '\n\n';
      } catch (pageError) {
        console.warn(`Error extracting text from page ${i}:`, pageError);
        text += `[Kunde inte läsa sida ${i}]\n\n`;
      }
    }
    
    if (!text.trim()) {
      throw new Error('Kunde inte extrahera text från PDF:en. Prova att spara den som vanlig text och ladda upp igen.');
    }
    
    return text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Kunde inte läsa PDF-filen. Kontrollera att den inte är lösenordsskyddad eller skadad.');
  }
};

// Enhanced Word document extraction
const extractWordText = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (!result.value.trim()) {
      throw new Error('Kunde inte extrahera text från Word-dokumentet.');
    }
    
    return result.value;
  } catch (error) {
    console.error('Word extraction error:', error);
    throw new Error('Kunde inte läsa Word-dokumentet. Kontrollera att filen inte är skadad.');
  }
};

// Enhanced RTF extraction
const extractRtfText = async (file: File): Promise<string> => {
  try {
    const text = await file.text();
    const cleaned = text.replace(/\{[^\}]*\}|\\[^\\]+/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (!cleaned) {
      throw new Error('Kunde inte extrahera text från RTF-filen.');
    }
    
    return cleaned;
  } catch (error) {
    console.error('RTF extraction error:', error);
    throw new Error('Kunde inte läsa RTF-filen.');
  }
};

// Enhanced HTML extraction
const extractHtmlText = async (file: File): Promise<string> => {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');
    const extracted = doc.body.textContent || '';
    
    if (!extracted.trim()) {
      throw new Error('Kunde inte extrahera text från HTML-filen.');
    }
    
    return extracted;
  } catch (error) {
    console.error('HTML extraction error:', error);
    throw new Error('Kunde inte läsa HTML-filen.');
  }
};

// New ODT extraction function
const extractOdtText = async (file: File): Promise<string> => {
  try {
    // For ODT files, we'll treat them as ZIP files and extract content.xml
    const text = await file.text();
    
    // Basic ODT text extraction (simplified)
    // In a real implementation, you'd parse the XML properly
    const cleanedText = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (!cleanedText) {
      throw new Error('Kunde inte extrahera text från ODT-filen.');
    }
    
    return cleanedText;
  } catch (error) {
    console.error('ODT extraction error:', error);
    throw new Error('Kunde inte läsa ODT-filen. Prova att exportera den som PDF eller DOCX.');
  }
};

// Generate legal counterarguments (keeping existing mock implementation)
export const generateCounterarguments = async (
  documents: { id: string, content: string }[]
): Promise<any> => {
  try {
    console.log('Generating counterarguments for', documents.length, 'documents');
    
    // Wait to simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Extract some text from the documents
    const combinedText = documents
      .map(doc => doc.content)
      .join(' ')
      .substring(0, 500);
    
    // Generate mock counterarguments based on document content
    return {
      claims: [
        {
          claim: "Avtalet är bindande enligt 1 § AvtL",
          counterarguments: [
            {
              argument: "Motparten saknade behörighet att ingå avtalet enligt 10 § 2 st. AvtL",
              strength: 0.92,
              references: ["NJA 2018 s. 301", "Högsta domstolens dom i mål T 3034-19"]
            },
            {
              argument: "Avtalet tillkom under svikligt förledande enligt 30 § AvtL",
              strength: 0.78,
              references: ["Prop. 2015/16:197 s. 188", "NJA 1995 s. 437"]
            },
            {
              argument: "Formkravet i 4 kap. 1 § Jordabalken är inte uppfyllt",
              strength: 0.65,
              references: ["NJA 2000 s. 747", "RH 1999:138"]
            },
            {
              argument: "Oskäligt avtalsvillkor enligt 36 § AvtL",
              strength: 0.51,
              references: ["MD 2009:35", "NJA 2017 s. 113"]
            }
          ]
        },
        {
          claim: "Skadeståndsskyldighet föreligger enligt 2 kap. 1 § SkL",
          counterarguments: [
            {
              argument: "Force majeure-situationen utesluter ansvar enligt principen i 27 § KöpL",
              strength: 0.88,
              references: ["NJA 2017 s. 9", "Högsta domstolens dom i mål T 1451-17"]
            },
            {
              argument: "Adekvat kausalitet saknas enligt praxis från HD",
              strength: 0.81,
              references: ["NJA 2011 s. 576", "NJA 2017 s. 9"]
            },
            {
              argument: "Medvållande enligt 6 kap. 1 § SkL reducerar ansvaret",
              strength: 0.75,
              references: ["NJA 1979 s. 129", "NJA 2000 s. 380"]
            },
            {
              argument: "Preskription enligt 2 § PreskL",
              strength: 0.42,
              references: ["NJA 2016 s. 505", "Svea hovrätts dom i mål T 7024-15"]
            }
          ]
        }
      ]
    };
  } catch (error) {
    console.error('Error generating counterarguments:', error);
    throw error;
  }
};
