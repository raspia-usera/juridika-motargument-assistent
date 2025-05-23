
import { jsPDF } from 'jspdf';

interface Claim {
  claim: string;
  counterarguments: {
    argument: string;
    strength: number;
    references: string[];
  }[];
}

interface AnalysisResult {
  claims: Claim[];
}

/**
 * Generate a PDF report from analysis results
 * @param results Analysis object with claims and counterarguments
 * @returns URL to the generated PDF
 */
export const generatePdfReport = (results: AnalysisResult): string => {
  // Create PDF with A4 format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Configure font sizes
  const fontSize = {
    title: 18,
    subtitle: 14,
    normal: 11,
    small: 9,
  };
  
  // Configure margins and positions
  let yPos = 20;
  const leftMargin = 20;
  const rightMargin = 190;
  const lineHeight = {
    title: 10,
    subtitle: 8,
    normal: 7,
    small: 5,
  };
  
  // Headers and introduction
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize.title);
  doc.text('Juridisk Analys', leftMargin, yPos);
  yPos += lineHeight.title * 2;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize.normal);
  doc.text('Genererad: ' + new Date().toLocaleString('sv-SE'), leftMargin, yPos);
  yPos += lineHeight.normal * 2;
  
  doc.text('Detta dokument innehåller en sammanställning av juridiska argument baserade på den genomförda analysen.', leftMargin, yPos, {
    maxWidth: rightMargin - leftMargin,
    align: 'left',
  });
  yPos += lineHeight.normal * 3;
  
  // Insert each claim and counterarguments
  if (results.claims && results.claims.length > 0) {
    results.claims.forEach((claim, index) => {
      // Claim
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize.subtitle);
      doc.text(`Påstående ${index + 1}: ${claim.claim}`, leftMargin, yPos);
      yPos += lineHeight.subtitle * 2;
      
      // Counterarguments
      if (claim.counterarguments && claim.counterarguments.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize.normal);
        doc.text('Motargument:', leftMargin, yPos);
        yPos += lineHeight.normal * 1.5;
        
        claim.counterarguments.forEach((counterarg, i) => {
          // Strength as percentage
          const strengthPercent = Math.round(counterarg.strength * 100);
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(fontSize.normal);
          doc.text(`${i + 1}. ${counterarg.argument} (${strengthPercent}%)`, leftMargin + 5, yPos);
          yPos += lineHeight.normal * 1.2;
          
          // References
          if (counterarg.references && counterarg.references.length > 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(fontSize.small);
            doc.text(`Referenser: ${counterarg.references.join(', ')}`, leftMargin + 10, yPos);
            yPos += lineHeight.normal * 1.5;
          }
        });
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(fontSize.normal);
        doc.text('Inga motargument hittades.', leftMargin + 5, yPos);
        yPos += lineHeight.normal * 1.5;
      }
      
      // Add extra space between claims
      yPos += lineHeight.normal * 2;
      
      // New page if needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(fontSize.normal);
    doc.text('Inga påståenden hittades att analysera.', leftMargin, yPos);
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize.small);
    doc.text(`Sida ${i} av ${pageCount}`, 105, 290, { align: 'center' });
    doc.text('Genererad av Juridika - juridisk analys med AI', 105, 295, { align: 'center' });
  }
  
  // Generate PDF as data URL
  return doc.output('datauristring');
};

/**
 * Direct download of PDF report from analysis results
 * @param results Analysis object with claims and counterarguments
 * @param filename Filename for the PDF document
 */
export const downloadPdfReport = (results: AnalysisResult, filename: string = 'juridisk-analys.pdf'): void => {
  // Create a new document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Configure font sizes
  const fontSize = {
    title: 18,
    subtitle: 14,
    normal: 11,
    small: 9,
  };
  
  // Configure margins and positions
  let yPos = 20;
  const leftMargin = 20;
  const rightMargin = 190;
  const lineHeight = {
    title: 10,
    subtitle: 8,
    normal: 7,
    small: 5,
  };
  
  // Headers and introduction
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(fontSize.title);
  doc.text('Juridisk Analys', leftMargin, yPos);
  yPos += lineHeight.title * 2;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fontSize.normal);
  doc.text('Genererad: ' + new Date().toLocaleString('sv-SE'), leftMargin, yPos);
  yPos += lineHeight.normal * 2;
  
  doc.text('Detta dokument innehåller en sammanställning av juridiska argument baserade på den genomförda analysen.', leftMargin, yPos, {
    maxWidth: rightMargin - leftMargin,
    align: 'left',
  });
  yPos += lineHeight.normal * 3;
  
  // Insert each claim and counterarguments
  if (results.claims && results.claims.length > 0) {
    results.claims.forEach((claim, index) => {
      // Claim
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(fontSize.subtitle);
      doc.text(`Påstående ${index + 1}: ${claim.claim}`, leftMargin, yPos);
      yPos += lineHeight.subtitle * 2;
      
      // Counterarguments
      if (claim.counterarguments && claim.counterarguments.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(fontSize.normal);
        doc.text('Motargument:', leftMargin, yPos);
        yPos += lineHeight.normal * 1.5;
        
        claim.counterarguments.forEach((counterarg, i) => {
          // Strength as percentage
          const strengthPercent = Math.round(counterarg.strength * 100);
          
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(fontSize.normal);
          doc.text(`${i + 1}. ${counterarg.argument} (${strengthPercent}%)`, leftMargin + 5, yPos);
          yPos += lineHeight.normal * 1.2;
          
          // References
          if (counterarg.references && counterarg.references.length > 0) {
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(fontSize.small);
            doc.text(`Referenser: ${counterarg.references.join(', ')}`, leftMargin + 10, yPos);
            yPos += lineHeight.normal * 1.5;
          }
        });
      } else {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(fontSize.normal);
        doc.text('Inga motargument hittades.', leftMargin + 5, yPos);
        yPos += lineHeight.normal * 1.5;
      }
      
      // Add extra space between claims
      yPos += lineHeight.normal * 2;
      
      // New page if needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
  } else {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(fontSize.normal);
    doc.text('Inga påståenden hittades att analysera.', leftMargin, yPos);
  }
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(fontSize.small);
    doc.text(`Sida ${i} av ${pageCount}`, 105, 290, { align: 'center' });
    doc.text('Genererad av Juridika - juridisk analys med AI', 105, 295, { align: 'center' });
  }
  
  // Download the PDF file
  doc.save(filename);
};
