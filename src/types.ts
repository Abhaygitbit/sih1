export type Jurisdiction = 'india' | 'international';
export type Language = 'en' | 'hi';
export type ActiveTab = 'home' | 'products' | 'laws' | 'chat' | 'classification' | 'resources';

export type ProductCategory = 
  | 'classical'
  | 'proprietary'
  | 'new_drug'
  | 'phytopharmaceutical'
  | 'nutraceutical'
  | 'cosmetic';

export type IngredientSource =
  | 'classical_text'
  | 'wild_bioresource'
  | 'cultivated_indian'
  | 'imported'
  | 'synthetic_derivative';

export type NoveltyClaim =
  | 'exact_classical'
  | 'novel_ratio_synergy'
  | 'novel_delivery_ndds'
  | 'novel_extraction_process'
  | 'purified_fraction';

export type CommercialTarget =
  | 'domestic_asu'
  | 'export_global'
  | 'clinical_trials'
  | 'academic_research';

export interface ClassificationState {
  category: ProductCategory;
  ingredientSource: IngredientSource;
  noveltyClaim: NoveltyClaim;
  commercialTarget: CommercialTarget;
}

export interface IPABSAssessment {
  categoryTitle: string;
  categoryHindi: string;
  patentStatus: string;
  absObligation: string;
  regulatoryBody: string;
  tkdlConflictRisk: 'High' | 'Medium' | 'Low' | 'Protective';
  bulletPoints: string[];
  statutoryCitations: string[];
  actionChecklist: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: string[];
  jurisdiction?: Jurisdiction;
  source?: 'gemini' | 'knowledge-base' | 'groq' | 'knowledge-engine';
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  jurisdiction: Jurisdiction;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  avatar?: string;
  joinedDate: string;
  savedConsultationsCount?: number;
  preferences: {
    defaultJurisdiction: Jurisdiction;
    preferredLanguage: Language;
    autoCitations: boolean;
    tkdlAlerts: boolean;
  };
}

export interface StatutoryGuide {
  id: string;
  title: string;
  titleHindi: string;
  act: string;
  summary: string;
  summaryHindi: string;
  tags: string[];
}
