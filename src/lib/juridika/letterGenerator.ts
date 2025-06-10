
import { supabase } from '@/integrations/supabase/client';

export interface LegalLetterTemplate {
  type: 'appeal' | 'objection' | 'notice' | 'complaint' | 'response';
  title: string;
  content: string;
  legalBasis: string[];
  requiredFields: string[];
}

export const generateLegalLetter = async (
  letterType: string,
  context: string,
  userDetails?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
  }
): Promise<LegalLetterTemplate | null> => {
  try {
    console.log('Generating legal letter:', letterType);

    const letterTemplates: Record<string, LegalLetterTemplate> = {
      appeal: {
        type: 'appeal',
        title: 'Överklagande av beslut',
        content: `Till [Mottagande myndighet/domstol]

Datum: ${new Date().toLocaleDateString('sv-SE')}

ÖVERKLAGANDE AV BESLUT

Undertecknad överklagande härmed beslut daterat [DATUM] med diarienummer [DIARIENUMMER].

Bakgrund:
${context}

Skäl för överklagandet:
- Beslutet är felaktigt med hänsyn till gällande lagstiftning
- Utredningen är bristfällig och inte tillräcklig för att motivera beslutet
- Proportionalitetsprincipen har inte beaktats

Rättslig grund:
Se förvaltningslagen och specifik sektorlagstiftning.

Yrkande:
Att beslutet upphävs och ärendet återförvisas för ny prövning.

Med vänlig hälsning,
${userDetails?.name || '[DITT NAMN]'}
${userDetails?.address || '[DIN ADRESS]'}
${userDetails?.email || '[DIN E-POST]'}
${userDetails?.phone || '[DITT TELEFONNUMMER]'}`,
        legalBasis: ['Förvaltningslagen', 'Europakonventionen', 'Regeringsformen'],
        requiredFields: ['Beslutsdatum', 'Diarienummer', 'Mottagare']
      },

      objection: {
        type: 'objection',
        title: 'Invändning mot krav',
        content: `Till [Mottagare]

Datum: ${new Date().toLocaleDateString('sv-SE')}

INVÄNDNING MOT KRAV

Jag bestrider härmed ert krav daterat [DATUM] avseende [BESKRIVNING AV KRAV].

Bakgrund:
${context}

Skäl för invändning:
- Kravet saknar rättslig grund
- Fordringen är preskriberad
- Bevisbördan är inte uppfylld

Jag kräver att ni styrker ert krav med fullständig dokumentation och rättslig grund.

Med vänlig hälsning,
${userDetails?.name || '[DITT NAMN]'}`,
        legalBasis: ['Skuldebrevslagen', 'Preskriptionslagen', 'Konsumentköplagen'],
        requiredFields: ['Kravets datum', 'Beskrivning av krav', 'Mottagare']
      },

      notice: {
        type: 'notice',
        title: 'Uppsägning/uppmaning',
        content: `Till [Mottagare]

Datum: ${new Date().toLocaleDateString('sv-SE')}

UPPSÄGNING/UPPMANING

Härmed uppsäger/uppmanas ni att [SPECIFICERA ÅTGÄRD] med anledning av följande:

${context}

Rättslig grund:
[RELEVANT LAGSTIFTNING]

Om åtgärd inte vidtas inom [TIDSFRIST] kommer rättsliga åtgärder att övervägas.

Med vänlig hälsning,
${userDetails?.name || '[DITT NAMN]'}`,
        legalBasis: ['Avtalslagen', 'Hyreslagen', 'Konsumentköplagen'],
        requiredFields: ['Specificera åtgärd', 'Tidsfrist', 'Rättslig grund']
      }
    };

    const template = letterTemplates[letterType];
    if (!template) {
      console.error('Unknown letter type:', letterType);
      return null;
    }

    // Store generated letter in ai_analyses table instead of non-existent letters table
    const letterData = {
      session_id: 'public-session',
      document_ids: [],
      analysis_type: 'legal_letter_generation',
      legal_area: 'brevgenerering',
      analysis_results: {
        letterType: letterType,
        title: template.title,
        content: template.content,
        legalBasis: template.legalBasis,
        requiredFields: template.requiredFields,
        userDetails: userDetails || {},
        context: context
      } as any,
      confidence_metrics: {
        generation_confidence: 0.9
      } as any
    };

    const { data, error } = await supabase
      .from('ai_analyses')
      .insert(letterData)
      .select()
      .single();

    if (error) {
      console.error('Error storing letter:', error);
    } else {
      console.log('Letter stored with ID:', data?.id);
    }

    return template;
  } catch (error) {
    console.error('Error in generateLegalLetter:', error);
    return null;
  }
};

export const getLegalLetterTemplates = (): string[] => {
  return [
    'appeal',
    'objection', 
    'notice',
    'complaint',
    'response'
  ];
};
