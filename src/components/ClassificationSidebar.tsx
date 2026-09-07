import React from 'react';
import { 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Send, 
  Download, 
  ArrowRight, 
  Leaf, 
  Shield, 
  Cpu, 
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { 
  ClassificationState, 
  CommercialTarget, 
  IngredientSource, 
  Language, 
  NoveltyClaim, 
  ProductCategory 
} from '../types';
import { CLASSIFICATION_ASSESSMENTS, UI_TRANSLATIONS } from '../data/ayurvedaData';

interface ClassificationSidebarProps {
  classification: ClassificationState;
  setClassification: React.Dispatch<React.SetStateAction<ClassificationState>>;
  language: Language;
  onAskAboutClassification: (prompt: string) => void;
}

export const ClassificationSidebar: React.FC<ClassificationSidebarProps> = ({
  classification,
  setClassification,
  language,
  onAskAboutClassification
}) => {
  const t = UI_TRANSLATIONS[language];
  const assessment = CLASSIFICATION_ASSESSMENTS[classification.category];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassification(prev => ({
      ...prev,
      category: e.target.value as ProductCategory
    }));
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassification(prev => ({
      ...prev,
      ingredientSource: e.target.value as IngredientSource
    }));
  };

  const handleNoveltyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassification(prev => ({
      ...prev,
      noveltyClaim: e.target.value as NoveltyClaim
    }));
  };

  const handleTargetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setClassification(prev => ({
      ...prev,
      commercialTarget: e.target.value as CommercialTarget
    }));
  };

  const triggerChatInquiry = () => {
    const question = language === 'en'
      ? `I am developing a ${assessment.categoryTitle} sourced from ${classification.ingredientSource} with ${classification.noveltyClaim}. What are my immediate patentability hurdles under Section 3(p) and NBA Form 3 obligations?`
      : `मैं ${assessment.categoryHindi} विकसित कर रहा हूँ जो ${classification.ingredientSource} से प्राप्त है तथा जिसमें ${classification.noveltyClaim} का दावा है। धारा 3(p) और एनबीए फॉर्म 3 के तहत मेरी विधिक जिम्मेदारियां क्या हैं?`;
    onAskAboutClassification(question);
  };

  const handleExportDossier = () => {
    const dossierText = `=====================================================
IP-SAKTI SAHAYAK - AYURVEDIC IP & ABS READINESS REPORT
=====================================================
Product Classification: ${assessment.categoryTitle}
Classification Hindi: ${assessment.categoryHindi}
Ingredient Source: ${classification.ingredientSource}
Novelty Technical Claim: ${classification.noveltyClaim}
Target Market: ${classification.commercialTarget}

PATENTABILITY EVALUATION:
${assessment.patentStatus}

ACCESS & BENEFIT SHARING (ABS):
${assessment.absObligation}

REGULATORY AUTHORITY:
${assessment.regulatoryBody}

TKDL PRIOR ART CONFLICT RISK:
${assessment.tkdlConflictRisk}

KEY IP & REGULATORY BULLET POINTS:
${assessment.bulletPoints.map(b => `- ${b}`).join('\n')}

STATUTORY CITATIONS:
${assessment.statutoryCitations.map(c => `[+] ${c}`).join('\n')}

RECOMMENDED ACTION ITEMS:
${assessment.actionChecklist.map(a => `[ ] ${a}`).join('\n')}

Generated via IP-SAKTI Sahayak (AYUSH IP Guidance Assistant).
Disclaimer: This is informational guidance, not formal legal advice.
=====================================================`;

    const blob = new Blob([dossierText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IP-SAKTI-Dossier-${classification.category}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside 
      id="right-classification-sidebar"
      className="w-full lg:w-80 shrink-0 flex flex-col bg-white dark:bg-[#042423] border border-slate-200 dark:border-[#134e4a] rounded-2xl shadow-xs overflow-hidden lg:h-[580px]"
    >
      {/* Classification Main Content Area */}
      <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-3.5">
        
        {/* Header matching Professional Polish: text-[11px] font-bold text-slate-400 uppercase tracking-widest */}
        <div className="flex items-center justify-between">
          <h3 className="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0d9488]" />
            {t.classificationHeader}
          </h3>
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#f0fdf4] dark:bg-[#032924] text-[#166534] dark:text-[#4ade80] border border-[#dcfce7] dark:border-[#14532d]">
            Matrix v2
          </span>
        </div>

        {/* Multi-Step Dropdown Form */}
        <form id="product-classification-form" className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          
          {/* Step 1: Product Category Dropdown */}
          <div>
            <label htmlFor="select-product-category" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t.categoryStep} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="select-product-category"
                value={classification.category}
                onChange={handleCategoryChange}
                className="w-full appearance-none bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 pr-8"
              >
                <option value="classical">Classical Medicine (Shastriya Aushadhi)</option>
                <option value="proprietary">Proprietary ASU Medicine (Ayurveda Aushadhi)</option>
                <option value="new_drug">New Drug / NCE of Ayurvedic Origin</option>
                <option value="phytopharmaceutical">Phytopharmaceutical Drug (CDSCO)</option>
                <option value="nutraceutical">Nutraceutical (Ayurveda Aahara - FSSAI)</option>
                <option value="cosmetic">Cosmetic (Saundarya Prasadana - AYUSH/BIS)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Step 2: Source of Ingredients */}
          <div>
            <label htmlFor="select-ingredient-source" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t.sourceStep}
            </label>
            <div className="relative">
              <select
                id="select-ingredient-source"
                value={classification.ingredientSource}
                onChange={handleSourceChange}
                className="w-full appearance-none bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 pr-8"
              >
                <option value="classical_text">Classical Text Formula (Charaka/Sushruta/Sahasrayogam)</option>
                <option value="cultivated_indian">Cultivated Indian Bio-resource (GAP Certified Farm)</option>
                <option value="wild_bioresource">Wild-Harvested Forest Flora (Tribal / Forest Produce)</option>
                <option value="imported">Imported Botanical Extract (Outside India)</option>
                <option value="synthetic_derivative">Semi-synthetic Phyto-active Derivative</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Step 3: Novelty Claim */}
          <div>
            <label htmlFor="select-novelty-claim" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t.noveltyStep}
            </label>
            <div className="relative">
              <select
                id="select-novelty-claim"
                value={classification.noveltyClaim}
                onChange={handleNoveltyChange}
                className="w-full appearance-none bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 pr-8"
              >
                <option value="exact_classical">Verbatim Classical Recipe (No modification)</option>
                <option value="novel_ratio_synergy">Synergistic Combination (Proven non-obvious efficacy)</option>
                <option value="novel_delivery_ndds">Novel Drug Delivery System (Nanoparticle / Liposomal)</option>
                <option value="novel_extraction_process">Novel Extraction Process (Supercritical CO2 / Green solvent)</option>
                <option value="purified_fraction">Standardized Fraction (min 4 marker compounds)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Step 4: Commercial Target */}
          <div>
            <label htmlFor="select-commercial-target" className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
              {t.targetStep}
            </label>
            <div className="relative">
              <select
                id="select-commercial-target"
                value={classification.commercialTarget}
                onChange={handleTargetChange}
                className="w-full appearance-none bg-slate-50 dark:bg-[#021f1e] border border-slate-200 dark:border-[#134e4a] px-3 py-2 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 pr-8"
              >
                <option value="domestic_asu">Domestic ASU Retail (Indian Ayurvedic Market)</option>
                <option value="export_global">Global Export (US FDA / EU EMA / GCC Compliance)</option>
                <option value="clinical_trials">Formal Clinical Trials (CDSCO CT-04)</option>
                <option value="academic_research">Academic / Translational Research (R&D Only)</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </form>

        {/* Clean Card: "What this means for IP & ABS" matching Professional Polish */}
        <div 
          id="ip-abs-impact-card"
          className="p-4 bg-[#f8fafc] dark:bg-[#031d1c] rounded-xl border border-slate-200 dark:border-[#134e4a] shadow-sm space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0d9488] shrink-0" />
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                {t.whatMeansTitle}
              </h4>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
              assessment.tkdlConflictRisk === 'High' 
                ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                : assessment.tkdlConflictRisk === 'Medium'
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-[#dcfce7] text-[#166534] border border-[#bbf7d0]'
            }`}>
              TKDL: {assessment.tkdlConflictRisk}
            </span>
          </div>

          <div className="text-[11px] p-2 rounded-lg bg-white dark:bg-[#021f1e] border border-slate-200/80 dark:border-[#134e4a] space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">{t.patentabilityStatus}:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{assessment.patentStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">{t.absObligation}:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{assessment.absObligation}</span>
            </div>
          </div>

          {/* Bullet points exactly styled as in Professional Polish */}
          <ul className="space-y-2 mt-2">
            {assessment.bulletPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2 text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                <span className="text-teal-600 dark:text-teal-400 font-bold">&bull;</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* Statutory citations */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#134e4a] flex flex-wrap gap-1">
            {assessment.statutoryCitations.map((cite, index) => (
              <span 
                key={index}
                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-[#021f1e] text-slate-600 dark:text-teal-300 border border-slate-200 dark:border-white/10"
              >
                {cite}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons: Ask Sahayak & Export Report */}
        <div className="space-y-2">
          <button
            id="btn-ask-about-classification"
            type="button"
            onClick={triggerChatInquiry}
            className="w-full py-2.5 px-3 rounded-xl bg-[#042f2e] hover:bg-[#134e4a] dark:bg-[#0d9488] dark:hover:bg-[#14b8a6] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{t.askAboutProduct}</span>
          </button>

          <button
            id="btn-export-dossier"
            type="button"
            onClick={handleExportDossier}
            className="w-full py-2 px-3 rounded-xl bg-white dark:bg-[#021f1e] hover:bg-slate-50 dark:hover:bg-[#032e2a] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#134e4a] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#0d9488]" />
            <span>{t.exportReport}</span>
          </button>
        </div>
      </div>

      {/* Bottom Banner: Startup Support exactly from Professional Polish design */}
      <div className="p-4 sm:p-5 bg-teal-50 dark:bg-[#032926] border-t border-teal-100 dark:border-[#134e4a]">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[10px] font-bold text-teal-800 dark:text-teal-300 uppercase tracking-wide">Startup Support</span>
        </div>
        <p className="text-[10px] text-teal-700 dark:text-teal-300/80 leading-relaxed">
          AYUSH startups qualify for expedited patent examination under Rule 24C of Indian Patent Rules.
        </p>
      </div>
    </aside>
  );
};
