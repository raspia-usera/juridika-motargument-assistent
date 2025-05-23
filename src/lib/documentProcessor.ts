
import mammoth from 'mammoth';
import { pdfjs } from 'react-pdf';
import { supabase } from '@/integrations/supabase/client';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

// Upload document to storage
export const uploadDocument = async (file: File): Promise<string | null> => {
  try {
    // Import dynamically to avoid circular dependencies
    const { getSessionId, extractDocumentContent } = await import('./supabase');
    const sessionId = await getSessionId();
    
    if (!sessionId) {
      throw new Error('No session ID available');
    }
    
    // Upload to storage
    const filePath = `${sessionId}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
      
    if (uploadError) throw uploadError;

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
      
    if (insertError) throw insertError;
    
    // Process document to extract text
    const documentId = data?.id;
    if (documentId) {
      await processDocument(file, documentId);
    } else {
      throw new Error('No document ID returned');
    }
    
    return documentId;
  } catch (error) {
    console.error('Error uploading document:', error);
    return null;
  }
};

// Process different document types
export const processDocument = async (file: File, documentId: string): Promise<boolean> => {
  try {
    const fileType = file.type;
    let text = '';
    
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
    } else if (fileType === 'text/html') {
      text = await extractHtmlText(file);
    } else if (fileType === 'text/plain') {
      text = await file.text();
    } else {
      throw new Error('Filtypen stöds inte');
    }
    
    // Update document with extracted content
    const { extractDocumentContent } = await import('./supabase');
    return await extractDocumentContent(documentId, text);
  } catch (error) {
    console.error('Error processing document:', error);
    return false;
  }
};

// Extract text from PDF
const extractPdfText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    text += pageText + '\n\n';
  }
  
  return text;
};

// Extract text from Word documents
const extractWordText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

// Extract text from RTF (simplified)
const extractRtfText = async (file: File): Promise<string> => {
  // This is a simplified approach - in a production app you'd use a proper RTF parser
  const text = await file.text();
  // Basic RTF cleaning - removes RTF control sequences
  return text.replace(/\{[^\}]*\}|\\[^\\]+/g, ' ').replace(/\s+/g, ' ').trim();
};

// Extract text from HTML
const extractHtmlText = async (file: File): Promise<string> => {
  const text = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');
  return doc.body.textContent || '';
};

// Function to generate legal counterarguments using the local model
export const generateCounterarguments = async (
  documents: { id: string, content: string }[]
): Promise<any> => {
  try {
    // In a real implementation, this would use a local model or API
    // For this prototype, we'll generate mock results
    
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
