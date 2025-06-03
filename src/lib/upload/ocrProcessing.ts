
// Function to extract text from image using OCR.space API
export const extractTextFromImage = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('apikey', 'K87244774488957');
    formData.append('language', 'swe');
    formData.append('isOverlayRequired', 'false');
    formData.append('scale', 'true');
    formData.append('detectOrientation', 'true');
    formData.append('file', file);

    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result && result.ParsedResults && result.ParsedResults.length > 0) {
      return result.ParsedResults[0].ParsedText;
    } else {
      console.error('OCR failed or no text found:', result);
      return null;
    }
  } catch (error) {
    console.error('Error during OCR:', error);
    return null;
  }
};
