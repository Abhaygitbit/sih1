import { ClassificationState, IPABSAssessment, ProductCategory, StatutoryGuide } from '../types';

export const CLASSIFICATION_ASSESSMENTS: Record<ProductCategory, IPABSAssessment> = {
  classical: {
    categoryTitle: 'Classical Ayurvedic Medicine (Shastriya Aushadhi)',
    categoryHindi: 'शास्त्रीय आयुर्वेदिक औषधि (चरक/सुश्रुत संहिता आधारित)',
    patentStatus: 'Strictly Non-Patentable (Section 3(p) Indian Patents Act)',
    absObligation: 'Exempt for local Indian vaidyas/farmers; SBB notification required for commercial manufacturing',
    regulatoryBody: 'State AYUSH Licensing Authority (Drugs & Cosmetics Act 1940, Schedule T GMP)',
    tkdlConflictRisk: 'High',
    bulletPoints: [
      'Public Domain Prior Art: The formulation is documented in the 54 authoritative classical texts listed in Schedule I of the Drugs & Cosmetics Act, 1940 (e.g. Charaka Samhita, Sushruta Samhita, Sarngadhara Samhita, Bhavaprakasha).',
      'Section 3(p) Prohibition: Section 3(p) of the Indian Patents Act, 1970 bars patenting of traditional knowledge or aggregations/duplications of known properties.',
      'TKDL Protection: Fully catalogued in the Traditional Knowledge Digital Library (TKDL) across 4.5+ lakh formulations, used by USPTO, EPO, JPO to block foreign patent claims.',
      'Commercial Protection via Trademarks & Trade Dress: While composition cannot be patented, unique brand names, logos, distinctive packaging, and proprietary delivery forms can be trademarked under the Trade Marks Act, 1999.',
      'Access & Benefit Sharing (ABS): Under the Biological Diversity (Amendment) Act 2023, registered Indian AYUSH practitioners and cultivated bio-resources have streamlined exemptions, but commercial ASU manufacturers must file Form B with State Biodiversity Boards (SBB).'
    ],
    statutoryCitations: [
      'Indian Patents Act 1970 - Section 3(p)',
      'Drugs & Cosmetics Act 1940 - First Schedule',
      'Biological Diversity Act 2002/2023 - Section 7 & Rule 14',
      'CSIR-AYUSH TKDL IPC Classification (A61K 36/00)'
    ],
    actionChecklist: [
      'Verify formulation against First Schedule authorized textbooks',
      'Apply for ASU Manufacturing License under Rule 153/154 with GMP certification',
      'Conduct heavy metal, aflatoxin, and pesticide residue testing as per API standards',
      'File trademark application for brand identity instead of patent',
      'Submit intimation to State Biodiversity Board if sourcing wild bio-resources'
    ]
  },
  proprietary: {
    categoryTitle: 'Ayurvedic Proprietary Medicine (Patent & Proprietary ASU)',
    categoryHindi: 'आयुर्वेदिक प्रोप्राइटरी औषधि (आयुर्वेदिक घटक + नवीन अनुपात)',
    patentStatus: 'Conditional: Only with proven non-obvious synergy (Sec 3(e)) or novel delivery (NDDS)',
    absObligation: 'Mandatory SBB intimation (Indian firms) / NBA Form 1 & Form 3 approval (Foreign participation)',
    regulatoryBody: 'State AYUSH Licensing Authority (Rule 158B Proof of Effectiveness)',
    tkdlConflictRisk: 'Medium',
    bulletPoints: [
      'Formulation Novelty Threshold: Contains classical Ayurvedic ingredients, but combined in unique ratios or novel presentations (capsules, syrups, ointments) not verbatim from classical texts.',
      'Section 3(e) Synergism Hurdle: The Indian Patent Office (IPO) will issue a Section 3(e) objection (mere admixture). You must demonstrate verifiable synergistic enhancement (e.g. Combination Index CI < 0.8, isobologram data, significantly reduced dosage requirement).',
      'Section 3(d) Bioavailability: If utilizing known bioactives (e.g. withanolides, curcuminoids), you must demonstrate enhanced therapeutic efficacy, not just thermodynamic solubility.',
      'Novel Drug Delivery (NDDS) Gateway: Encapsulation in phytosomes, liposomes, nano-emulsions, or sustained-release biodegradable matrixes is a viable patentable pathway.',
      'ABS Compliance: Any patent filing in India or abroad requires prior approval from the National Biodiversity Authority (Form 3 under Section 6 of the Biological Diversity Act).'
    ],
    statutoryCitations: [
      'Indian Patents Act 1970 - Section 3(e) & 3(d)',
      'Biological Diversity Act 2002 - Section 6 (Form 3 Approval)',
      'Drugs & Cosmetics Rules 1945 - Rule 158B (Proof of Safety & Effectiveness)',
      'National Biodiversity Authority (ABS Guidelines, 2014 & 2023 Regulations)'
    ],
    actionChecklist: [
      'Document synergistic assays (in-vitro / in-vivo) with statistical significance',
      'Obtain NBA Form 3 prior approval BEFORE patent grant to avoid patent invalidation',
      'Compile safety, toxicity, and pilot clinical trial dossiers for Rule 158B license',
      'Check TKDL prior art to prevent citations against individual ingredient properties',
      'Draft patent claims focusing on delivery formulation or precise synergistic weight ratios'
    ]
  },
  new_drug: {
    categoryTitle: 'New Chemical Entity / Biologic of Ayurvedic Origin',
    categoryHindi: 'नवीन औषधि / सिंथेटिक व्युत्पन्न (Ayurveda-derived NCE)',
    patentStatus: 'Fully Patentable (Composition of Matter, Synthesis Process, Use Claims)',
    absObligation: 'Critical: Mandatory NBA Form 1, Form 2, and Form 3 clearances with benefit-sharing agreement',
    regulatoryBody: 'Central Drugs Standard Control Organisation (CDSCO) - New Drugs Division',
    tkdlConflictRisk: 'Low',
    bulletPoints: [
      'Composition of Matter Patent: If you have synthesized a novel chemical derivative or isolated a previously uncharacterized molecule with novel structure, it is fully patentable under Section 2(1)(j) of the Patents Act.',
      'Non-Obviousness & Industrial Application: Must demonstrate standard novelty, inventive step, and industrial applicability without relying on simple obvious plant extraction.',
      'Stringent NBA Scrutiny: Because the discovery traces back to an Indian genetic/biological resource, Section 3, 4, and 6 of the Biological Diversity Act strictly apply. Up to 0.5% - 3% gross ex-factory benefit-sharing royalty may be mandated.',
      'CDSCO Investigational New Drug (IND): Requires full Schedule Y / New Drugs and Clinical Trials Rules 2019 compliance (GLP toxicity, Phase I-III clinical trials).',
      'International Patent Strategy: File provisional application in India, followed by PCT within 12 months. Mandatory NBA approval required before commercial exploitation or grant.'
    ],
    statutoryCitations: [
      'Indian Patents Act 1970 - Section 2(1)(j) & Section 10',
      'Biological Diversity Act 2002 - Section 3, 4, 6 & Form 3',
      'New Drugs and Clinical Trials Rules 2019',
      'Patent Cooperation Treaty (PCT) - Rule 4.10'
    ],
    actionChecklist: [
      'Complete full NMR, HPLC, mass spectrometry structural characterization',
      'Execute formal Access & Benefit Sharing Agreement with NBA',
      'Conduct GLP animal toxicology and pharmacokinetic (PK/PD) studies',
      'File Indian priority patent application with complete disclosure of geographical origin',
      'Prepare CDSCO IND application for Phase 1 clinical trial protocol'
    ]
  },
  phytopharmaceutical: {
    categoryTitle: 'Phytopharmaceutical Drug (CDSCO Gazette 2015)',
    categoryHindi: 'फाइटोफार्मास्युटिकल ड्रग (मानकीकृत वानस्पतिक अंश - CDSCO)',
    patentStatus: 'Highly Patentable (Purification Process, Standardized Fraction, Therapeutic Utility)',
    absObligation: 'Mandatory NBA clearance; Traceability of cultivation and harvest origin required',
    regulatoryBody: 'CDSCO (Drugs & Cosmetics Amendment Rules 2015, Rule 122E)',
    tkdlConflictRisk: 'Medium',
    bulletPoints: [
      'Regulatory Definition: A purified, standardized botanical fraction containing at least 4 bioactive chemical markers, obtained from a plant part with minimum 60% quantified active markers.',
      'Process Patent Protection: Highly eligible for process patents covering extraction parameters (temperature, solvent fractionation, column chromatography) and synergistic fraction profiles.',
      'Bridge Between Modern Medicine & Ayurveda: Can be prescribed by allopathic doctors and sold in standard retail pharmacies once approved by CDSCO.',
      'Clinical Trial Requirements: Must submit stability data, safety pharmacology, mutagenicity data, and human clinical trial reports (Phase I/II/III or Phase II/III depending on documented traditional use).',
      'ABS & Biodiversity Traceability: Detailed GAP (Good Agricultural Practices) and batch-to-batch chemical fingerprinting (HPTLC/LC-MS) required alongside NBA clearance.'
    ],
    statutoryCitations: [
      'Drugs & Cosmetics Amendment Rules 2015 - Gazette Notification GSR 918(E)',
      'Indian Patents Act 1970 - Process & Formulation Claims',
      'Biological Diversity Act 2002 - Bio-resource Utilization',
      'Indian Pharmacopoeia (IP) Phytopharmaceutical Monograph Standards'
    ],
    actionChecklist: [
      'Validate minimum 4 chemical marker assays via HPLC/GC-MS across 3 consecutive batches',
      'Draft patent claims focused on the specific fingerprint fraction profile & extraction process',
      'Submit Form CT-04 to CDSCO for clinical trial permission',
      'Obtain certificate of origin and NBA approval for bioresource access',
      'Establish GAP (Good Agricultural Practices) contracts with certified farmers'
    ]
  },
  nutraceutical: {
    categoryTitle: 'Ayurvedic Nutraceutical / Ayurveda Aahara',
    categoryHindi: 'आयुर्वेदिक न्यूट्रास्युटिकल / आयुर्वेद आहार (FSSAI विनियम 2022)',
    patentStatus: 'Process & Functional Delivery Patentable; Composition usually unpatentable',
    absObligation: 'State Biodiversity Board intimation for commercial sourcing of herbs',
    regulatoryBody: 'Food Safety and Standards Authority of India (FSSAI) & AYUSH Joint Committee',
    tkdlConflictRisk: 'High',
    bulletPoints: [
      'Regulatory Framework: Governed by FSSAI (Ayurveda Aahara) Regulations, 2022. Covers foods prepared as per authoritative Ayurvedic recipe books for dietary well-being, but not claimed to cure diseases.',
      'Labeling Constraints: Strict bar on medical/curative claims (e.g. "treats diabetes" is forbidden; "supports healthy glycemic metabolism" is permissible).',
      'Patent Scope: Composition of known dietary herbs (Amla, Ginger, Turmeric) is barred under Sec 3(p). However, taste-masking technologies, chewable gummy stabilization, effervescent tablets, and shelf-life extension processes can be patented.',
      'ABS Exemption for Agriculture: Cultivated agricultural/horticultural produce has partial exemptions under the Biological Diversity Act, but commercial wild-harvested herbs require SBB clearance.',
      'Rapid Market Entry: Typically does not require 2-3 years of clinical trials like pharmaceuticals, allowing faster time-to-market for AYUSH food entrepreneurs.'
    ],
    statutoryCitations: [
      'Food Safety and Standards (Ayurveda Aahara) Regulations, 2022',
      'Food Safety and Standards (Health Supplements, Nutraceuticals) Regulations, 2022',
      'Indian Patents Act 1970 - Section 3(p) & Section 3(e)',
      'Biological Diversity Act 2002 - Section 7'
    ],
    actionChecklist: [
      'Verify ingredients against permitted list in Ayurveda Aahara Schedule A & B',
      'Apply for FSSAI Central License under Ayurveda Aahara category',
      'Audit all marketing copy, packaging, and digital claims to eliminate curative claims',
      'File process/packaging patent for innovative delivery forms (e.g. stable herbal gummies)',
      'Maintain raw material batch traceability certificates from suppliers'
    ]
  },
  cosmetic: {
    categoryTitle: 'Ayurvedic Cosmetic (Saundarya Prasadana)',
    categoryHindi: 'आयुर्वेदिक सौंदर्य प्रसाधन (हर्बल कॉस्मेटिक्स / सौन्दर्य रसायन)',
    patentStatus: 'Process, Preservation & Delivery Patentable; Classical herbal base in public domain',
    absObligation: 'SBB notification if sourcing wild bio-resources; Exemption for cultivated flora',
    regulatoryBody: 'State AYUSH Licensing Authority (Drugs & Cosmetics Act, Rule 158B)',
    tkdlConflictRisk: 'Medium',
    bulletPoints: [
      'Classification Nuance: Can be licensed either under AYUSH as Ayurvedic Cosmetic (Saundarya Prasadana) using classical herbs (Kumkumadi, Chandan, Manjistha), or under Bureau of Indian Standards (BIS) IS:4707 cosmetic standards.',
      'Patentability Frontiers: High success in patenting natural preservative complexes (replacing parabens with bio-fermented extracts), transdermal absorption accelerators, or micro-encapsulation of essential oils.',
      'Sec 3(p) Caution: Simply blending Aloe Vera, Saffron, and Sandalwood oil into a cream base will be rejected by the Patent Office as an obvious combination.',
      'Global Export Positioning: Huge international demand (US FDA cosmetic regulations, EU Cosmetic Regulation 1223/2009 require Safety Assessment Dossier and CPNP notification).',
      'Geographical Indication (GI) Synergies: Fantastic opportunities for brand enhancement by utilizing GI-certified raw materials like Mysore Sandalwood Oil or Kannauj Rose Otto.'
    ],
    statutoryCitations: [
      'Drugs and Cosmetics Rules, 1945 - Part XVI (Cosmetics)',
      'Bureau of Indian Standards (BIS) - IS 4707 (Part 1 & 2)',
      'Indian Patents Act 1970 - Section 3(p) & 3(d)',
      'EU Cosmetics Regulation (EC) No 1223/2009'
    ],
    actionChecklist: [
      'Formulate without banned heavy metals (Mercury, Lead, Arsenic) to ensure global compliance',
      'File patent for proprietary bio-preservative or transdermal delivery liposome',
      'Obtain Ayurvedic Cosmetic Manufacturing License from State AYUSH Licensing Authority',
      'Secure GI user certification if marketing regional botanical heritage',
      'Prepare Cosmetic Product Safety Report (CPSR) for export readiness'
    ]
  }
};

export const STATUTORY_GUIDES: StatutoryGuide[] = [
  {
    id: 'sec_3p',
    title: 'Section 3(p) - Traditional Knowledge Bar',
    titleHindi: 'धारा 3(p) - पारंपरिक ज्ञान पर पेटेंट का निषेध',
    act: 'Indian Patents Act, 1970',
    summary: 'Prohibits patenting an invention which is traditional knowledge or an aggregation of known properties of traditional herbs. Essential defense against biopiracy.',
    summaryHindi: 'पारंपरिक ज्ञान या ज्ञात गुणों के मात्र मिश्रण को पेटेंट कराने से रोकता है। चरक व सुश्रुत संहिता के फॉर्मूलेशन सार्वजनिक ज्ञान हैं।',
    tags: ['Patent Eligibility', 'Prior Art', 'TKDL']
  },
  {
    id: 'sec_3e',
    title: 'Section 3(e) - Mere Admixture vs Synergy',
    titleHindi: 'धारा 3(e) - मात्र मिश्रण बनाम वैज्ञानिक सिनर्जी',
    act: 'Indian Patents Act, 1970',
    summary: 'Mere mixture of known substances is unpatentable unless unexpected synergistic therapeutic augmentation is proven via clinical or pharmacodynamic data.',
    summaryHindi: 'ज्ञात घटकों का साधारण मिश्रण पेटेंट योग्य नहीं है, जब तक कि प्रयोगशाला या क्लिनिकल डेटा से अप्रत्याशित प्रभाव सिद्ध न हो।',
    tags: ['Synergy Assay', 'Combination Index', 'Efficacy']
  },
  {
    id: 'nba_abs',
    title: 'NBA Form 3 - IPR Prior Approval',
    titleHindi: 'एनबीए फॉर्म 3 - बौद्धिक संपदा पूर्व अनुमोदन',
    act: 'Biological Diversity Act, 2002 (Sec 6)',
    summary: 'Mandatory approval from the National Biodiversity Authority BEFORE applying for or being granted any patent in India or overseas based on Indian biological resources.',
    summaryHindi: 'भारतीय जैविक संसाधनों पर आधारित पेटेंट के लिए आवेदन करने से पहले राष्ट्रीय जैव विविधता प्राधिकरण से मंजूरी अनिवार्य है।',
    tags: ['NBA Compliance', 'ABS Form 3', 'Export Clearance']
  },
  {
    id: 'tkdl_db',
    title: 'TKDL - Prior Art Digital Library',
    titleHindi: 'टीकेडीएल - पारंपरिक ज्ञान डिजिटल लाइब्रेरी',
    act: 'CSIR & Ministry of AYUSH Initiative',
    summary: 'Database of 4.5+ lakh classical formulations translated into English, German, French, Japanese, and Spanish, accessible to global patent examiners.',
    summaryHindi: '4.5 लाख से अधिक आयुर्वेदिक योगों का अंतर्राष्ट्रीय पेटेंट कार्यालयों के लिए वैज्ञानिक वर्गीकरण (IPC), जो विदेशी पेटेंट दावों को रोकता है।',
    tags: ['Biopiracy Shield', 'CSIR-AYUSH', 'Prior Art']
  },
  {
    id: 'gi_goods',
    title: 'GI Act 1999 - Geographical Indications',
    titleHindi: 'जीआई अधिनियम 1999 - भौगोलिक उपदर्शन संरक्षण',
    act: 'Geographical Indications of Goods Act, 1999',
    summary: 'Legal protection for indigenous cultivars and agricultural products tied to unique geographic origins (e.g. Navara Rice, Alleppey Green Cardamom).',
    summaryHindi: 'विशेष भौगोलिक क्षेत्र की दुर्लभ औषधीय फसलों (जैसे नवारा चावल, कश्मीरी केसर, मालाबार काली मिर्च) को विशेष बौद्धिक संपदा सुरक्षा।',
    tags: ['Cultivator Rights', 'Regional Heritage', 'Premium Brand']
  }
];

export const SAMPLE_PROMPTS = [
  {
    en: 'Can I patent a synergistic combination of Ashwagandha and Curcumin?',
    hi: 'क्या मैं अश्वगंधा और करक्यूमिन के मिश्रण पर पेटेंट ले सकता हूँ?',
    topic: 'Section 3(p) & 3(e) Synergy'
  },
  {
    en: 'Do I need NBA Form 3 approval before filing a PCT international patent?',
    hi: 'क्या अंतर्राष्ट्रीय पीसीटी पेटेंट दाखिल करने से पहले एनबीए फॉर्म 3 जरूरी है?',
    topic: 'NBA / ABS Compliance'
  },
  {
    en: 'What is the difference between Classical Ayurvedic vs Proprietary Medicine?',
    hi: 'शास्त्रीय आयुर्वेदिक और प्रोप्राइटरी औषधि में बौद्धिक संपदा का क्या अंतर है?',
    topic: 'Regulatory & IP Differences'
  },
  {
    en: 'How do I register a Geographical Indication (GI) for an indigenous Ayurvedic cultivar?',
    hi: 'किसी दुर्लभ औषधीय पौधे के लिए भौगोलिक उपदर्शन (GI) पंजीकरण कैसे करें?',
    topic: 'GI of Goods Act'
  }
];

export const UI_TRANSLATIONS = {
  en: {
    disclaimer: 'This is information only. Not legal advice. Consult a human IP practitioner.',
    brandSubtitle: 'AI Assistant for Ayurveda Intellectual Property & Regulatory Compliance',
    jurisdictionLabel: 'Jurisdiction Focus',
    jurisdictionIndia: 'India (IP Act / NBA)',
    jurisdictionIntl: 'International (PCT / WIPO)',
    greetingTitle: 'Welcome to IP-SAKTI Sahayak!',
    greetingSubtitle: 'I am your AI assistant for Ayurveda Intellectual Property guidance. Ask me anything about patents, GI, ABS, TKDL, Drugs & Cosmetics Act, etc.',
    chatPlaceholder: 'Ask about Section 3(p), NBA Form 3, TKDL prior art, or proprietary formulations...',
    classificationHeader: 'Ayurvedic Product IP Classifier',
    classificationDesc: 'Select your product specifications to instantly assess Patentability, ABS liabilities, and statutory requirements.',
    categoryStep: '1. Product Category',
    sourceStep: '2. Ingredient Source',
    noveltyStep: '3. Novelty / Technical Claim',
    targetStep: '4. Commercial Target',
    whatMeansTitle: 'What this means for IP & ABS',
    patentabilityStatus: 'Patentability Status',
    absObligation: 'Access & Benefit Sharing (ABS)',
    regulatoryBody: 'Regulatory Authority',
    tkdlRisk: 'TKDL Prior-Art Conflict Risk',
    keyActionItems: 'Key Action Items for Startups',
    statutoryReferences: 'Statutory References',
    askAboutProduct: 'Ask Sahayak About This Classification',
    exportReport: 'Export IP Readiness Summary',
    navHome: 'Home',
    navChat: 'Chat',
    navClassification: 'Classification',
    navResources: 'Resources',
    footerMadeFor: 'Made for AYUSH startups & cultivators',
    footerGovtInitiatives: 'Aligned with Ministry of AYUSH, CSIR-TKDL, and National Biodiversity Authority',
    clearChat: 'Clear Chat',
    quickQuestions: 'Suggested Quick Questions',
    knowledgeShield: 'Ayurvedic IP Knowledge Shield'
  },
  hi: {
    disclaimer: 'यह केवल सूचनात्मक मार्गदर्शन है। कानूनी सलाह नहीं। किसी योग्य बौद्धिक संपदा सलाहकार से परामर्श लें।',
    brandSubtitle: 'आयुर्वेद बौद्धिक संपदा और नियामक अनुपालन हेतु आपका एआई सहायक',
    jurisdictionLabel: 'अधिकार क्षेत्र (Jurisdiction)',
    jurisdictionIndia: 'भारत (पेटेंट अधिनियम / NBA)',
    jurisdictionIntl: 'अंतर्राष्ट्रीय (PCT / WIPO)',
    greetingTitle: 'आईपी-शक्ति सहायक में आपका स्वागत है!',
    greetingSubtitle: 'मैं आयुर्वेद बौद्धिक संपदा मार्गदर्शन के लिए आपका एआई सहायक हूँ। मुझसे पेटेंट, जीआई, एबीएस, टीकेडीएल, ड्रग्स एंड कॉस्मेटिक्स एक्ट आदि के बारे में कुछ भी पूछें।',
    chatPlaceholder: 'धारा 3(p), एनबीए फॉर्म 3, टीकेडीएल पूर्व कला, या प्रोप्राइटरी फॉर्मूलेशन के बारे में पूछें...',
    classificationHeader: 'आयुर्वेदिक उत्पाद आईपी वर्गीकरण',
    classificationDesc: 'पेटेंट योग्यता, एबीएस देनदारियों और नियामक आवश्यकताओं का त्वरित विश्लेषण करने हेतु विकल्प चुनें।',
    categoryStep: '1. उत्पाद श्रेणी',
    sourceStep: '2. सामग्री का स्रोत',
    noveltyStep: '3. नवीनता / तकनीकी दावा',
    targetStep: '4. व्यावसायिक लक्ष्य',
    whatMeansTitle: 'बौद्धिक संपदा एवं ABS के लिए इसका क्या अर्थ है',
    patentabilityStatus: 'पेटेंट योग्यता स्थिति',
    absObligation: 'पहुंच और लाभ साझाकरण (ABS)',
    regulatoryBody: 'नियामक प्राधिकरण',
    tkdlRisk: 'TKDL पूर्व-कला टकराव जोखिम',
    keyActionItems: 'स्टार्टअप्स के लिए प्रमुख कार्य',
    statutoryReferences: 'वैधानिक संदर्भ (Acts & Rules)',
    askAboutProduct: 'इस वर्गीकरण पर सहायक से पूछें',
    exportReport: 'आईपी तैयारी सारांश निर्यात करें',
    navHome: 'होम',
    navChat: 'संवाद (Chat)',
    navClassification: 'वर्गीकरण',
    navResources: 'संसाधन',
    footerMadeFor: 'आयुष स्टार्टअप्स और औषधीय कृषकों के लिए समर्पित',
    footerGovtInitiatives: 'आयुष मंत्रालय, सीएसआईआर-टीकेडीएल, और राष्ट्रीय जैव विविधता प्राधिकरण के दिशानिर्देशों पर आधारित',
    clearChat: 'चैट साफ़ करें',
    quickQuestions: 'सुझाए गए त्वरित प्रश्न',
    knowledgeShield: 'आयुर्वेदिक आईपी ज्ञान कवच'
  }
};
