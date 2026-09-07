export interface CategoryLaw {
  id: string;
  category: string;
  actTitle: string;
  sectionOrRule: string;
  enforcingAuthority: string;
  coreObjective: string;
  plainSummary: string;
  keyLegalRequirements: string[];
  patientSafetyProvisions: string[];
  patentAndIpImpact: string;
  citationReference: string;
  tag: string;
}

export const DIRECT_LAWS_DATA: CategoryLaw[] = [
  {
    id: 'law-classical',
    category: 'Classical Ayurvedic Formulations',
    actTitle: 'Drugs and Cosmetics Act, 1940 & Rules 1945',
    sectionOrRule: 'Section 3(a), First Schedule & Rule 161',
    enforcingAuthority: 'State Licensing Authority (AYUSH) & Ministry of Ayush',
    coreObjective: 'Ensure authentic adherence to 54 classical authoritative texts without alteration of standard recipes.',
    plainSummary: 'Classical Ayurvedic medicines are exempt from animal clinical trials if manufactured exactly according to recipes in 54 recognized classical texts listed in the First Schedule. All ingredients must match the classical pharmacopoeial monograph.',
    keyLegalRequirements: [
      'Ingredients and manufacturing processes must strictly match First Schedule classical texts (Charaka, Sushruta, AFI, etc.)',
      'Manufacturing premises must hold valid Schedule T GMP certification with qualified Vaidyas overseeing production',
      'Labels must disclose the specific authoritative text name, classical formulation name, batch number, and AYUSH license number',
      'Prohibited from adding any modern allopathic synthetic active pharmaceutical ingredients (APIs)'
    ],
    patientSafetyProvisions: [
      'Schedule E(1) toxic herbs (e.g., Vatsanabha, Bhallataka) require mandatory Shodhana (purification) processes',
      'Finished product testing for heavy metals (Lead, Cadmium, Arsenic, Mercury) within Ayurvedic Pharmacopoeia limits',
      'Microbial limits and pesticide residue screening required before market release'
    ],
    patentAndIpImpact: 'Strictly barred from patenting under Section 3(p) of the Patents Act because classical recipes are public domain prior art catalogued in TKDL.',
    citationReference: 'Drugs & Cosmetics Act, 1940 (23 of 1940), First Schedule & Rule 161',
    tag: 'Classical ASU'
  },
  {
    id: 'law-proprietary',
    category: 'Ayurvedic Proprietary Medicines',
    actTitle: 'Drugs and Cosmetics Rules, 1945',
    sectionOrRule: 'Rule 158B (Proof of Safety & Efficacy)',
    enforcingAuthority: 'State AYUSH Licensing Authority & Pharmacopoeia Commission for Indian Medicine',
    coreObjective: 'Establish scientific evidence of safety, stability, and therapeutic rationality for new herbal combinations.',
    plainSummary: 'If an Ayurvedic product uses botanical ingredients outside exact classical ratios or introduces a new dosage form, Rule 158B mandates documentary safety data, accelerated stability testing (minimum 3 months), and published clinical literature before a license is granted.',
    keyLegalRequirements: [
      'All botanical ingredients must still be referenced in authoritative books of the First Schedule',
      'Submission of pilot clinical studies or published pharmacological research proving therapeutic efficacy',
      'Real-time and accelerated stability study data establishing minimum 2-year to 3-year shelf life',
      'Heavy metal, pesticide residue, and aflatoxin clearance reports from NABL-accredited laboratories'
    ],
    patientSafetyProvisions: [
      'Toxicological safety data required if novel extraction solvents other than water or classical sneha are used',
      'Child and pregnant women cautionary warnings must be prominently inscribed on cartons',
      'Standardized dosage instructions and duration of safe consumption clearly specified'
    ],
    patentAndIpImpact: 'Can be considered for patents under Section 3(e) ONLY if synergistic efficacy is proven with quantitative Combination Index (CI < 0.8), or novel drug delivery under Section 3(d).',
    citationReference: 'G.S.R. 512(E), dated 10th August 2010 (Insertion of Rule 158B)',
    tag: 'Rule 158B'
  },
  {
    id: 'law-patents',
    category: 'Patents & Traditional Knowledge Bar',
    actTitle: 'The Patents Act, 1970 (as amended 2005)',
    sectionOrRule: 'Section 3(p) & Section 3(e)',
    enforcingAuthority: 'Controller General of Patents, Designs and Trade Marks (CGPDTM)',
    coreObjective: 'Prevent illicit commercial patenting and biopiracy of traditional Indian medicinal knowledge.',
    plainSummary: 'Section 3(p) bars patenting of an invention which in effect is traditional knowledge or an aggregation or duplication of known properties of traditionally known components. Overcoming 3(p) requires proven non-obvious synergistic enhancement or technological delivery innovation.',
    keyLegalRequirements: [
      'Invention must not be an obvious combination of well-known medicinal plants (e.g., Turmeric + Neem is non-patentable)',
      'Applicants must disclose foreign and Indian bio-resource sourcing in Form 1 (Section 10(4)(ii)(D))',
      'Patent examiners systematically verify applications against CSIR’s Traditional Knowledge Digital Library (TKDL)',
      'Section 3(e) requires experimental biological data proving the combination gives unexpected synergistic results'
    ],
    patientSafetyProvisions: [
      'Prevents monopolistic price gouging on ancient medicinal cures, keeping essential Ayurvedic remedies affordable to patients',
      'Ensures public domain access for community healthcare and registered Ayurvedic practitioners'
    ],
    patentAndIpImpact: 'Fundamental threshold test for all herbal, botanical, and AYUSH patent applications in India and global patent offices.',
    citationReference: 'The Patents Act, 1970 (Act 39 of 1970), Section 3(p) & Section 3(e)',
    tag: 'Section 3(p)'
  },
  {
    id: 'law-biodiversity',
    category: 'Biological Resources & Access Sharing (ABS)',
    actTitle: 'The Biological Diversity Act, 2002 & Amendment 2023',
    sectionOrRule: 'Sections 3, 4, 6 & Form 3 Regulations',
    enforcingAuthority: 'National Biodiversity Authority (NBA) & State Biodiversity Boards (SBB)',
    coreObjective: 'Equitable sharing of commercial benefits arising out of the utilization of biological resources with indigenous local communities.',
    plainSummary: 'Section 6 mandates that any person seeking an intellectual property right (patent) based on biological resources obtained from India must obtain prior approval of the NBA (Form 3). Commercial manufacturers must also pay Access and Benefit Sharing (ABS) fees to SBBs.',
    keyLegalRequirements: [
      'Form 3 approval from NBA must be received BEFORE the patent is formally granted by the Indian Patent Office',
      'Commercial manufacturers of herbal products must intimate the State Biodiversity Board and deposit 0.1% to 0.5% ABS cess',
      'Commercial utilization of wild bio-resources requires sustainable harvesting certification',
      'Exemptions exist for registered local AYUSH practitioners and cultivated agricultural commodities under Section 40'
    ],
    patientSafetyProvisions: [
      'Promotes sustainable cultivation of endangered herbs (e.g., Jatamansi, Sarpgandha), avoiding depletion and ensuring unadulterated medicine supply',
      'Ensures traceability of botanical raw materials back to clean geographical origins'
    ],
    patentAndIpImpact: 'Failure to obtain NBA Form 3 approval leads to automatic revocation or abandonment of the patent under Section 64.',
    citationReference: 'Biological Diversity Act, 2002 (Act 18 of 2003) & BDA Amendment Act, 2023',
    tag: 'NBA / ABS'
  },
  {
    id: 'law-ayurvada-aahar',
    category: 'Ayurvedic Food & Dietary Supplements',
    actTitle: 'Food Safety and Standards (Ayurveda Aahar) Regulations, 2022',
    sectionOrRule: 'FSSAI Regulations 2022, Schedule I - IV',
    enforcingAuthority: 'Food Safety and Standards Authority of India (FSSAI) in consultation with Ministry of Ayush',
    coreObjective: 'Establish dedicated safety and quality benchmarks for food supplements prepared according to Ayurvedic principles.',
    plainSummary: 'Ayurveda Aahar refers to foods prepared in accordance with recipes or processes in authoritative Ayurvedic books. They are distinct from Ayurvedic drugs and must not claim to cure, treat, or prevent human diseases, but can support daily wellness.',
    keyLegalRequirements: [
      'Must display the official green "Ayurveda Aahar" logo prominently on the principal display panel',
      'Prohibited from adding vitamins, synthetic minerals, or synthetic amino acids to pure botanical preparations',
      'Must clearly state on the label: "ONLY FOR DIETARY USE, NOT FOR MEDICINAL USE"',
      'Raw botanical materials must comply with heavy metal, pesticide, and mycotoxin thresholds of FSSAI Schedule III'
    ],
    patientSafetyProvisions: [
      'Target consumer age category and daily consumption limits must be explicitly specified',
      'Prohibited from containing Schedule E(1) hazardous botanicals or Schedule H allopathic substances'
    ],
    patentAndIpImpact: 'Can protect unique manufacturing processes and functional trademark branding, while generic food recipes remain in the public domain.',
    citationReference: 'FSSAI Notification F. No. Std/SP-05/A-1.2022, dated 5th May 2022',
    tag: 'Ayurveda Aahar'
  },
  {
    id: 'law-magic-remedies',
    category: 'Advertising & Medical Claims Prohibition',
    actTitle: 'Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954',
    sectionOrRule: 'Sections 3, 4 & 7 & Schedule of 54 Conditions',
    enforcingAuthority: 'Drug Controllers & Designated State Enforcement Officers',
    coreObjective: 'Protect vulnerable patients from deceptive, fraudulent, or exaggerated cure claims for chronic illnesses.',
    plainSummary: 'Strictly prohibits any advertisement or label claiming that an Ayurvedic drug or herbal remedy can cure, prevent, or diagnose any of the 54 listed diseases, including diabetes, cancer, blindness, kidney failure, epilepsy, and high blood pressure.',
    keyLegalRequirements: [
      'No advertisement can suggest magical or 100% guaranteed cures for listed schedule conditions',
      'Labels and digital marketing campaigns must be audited to ensure zero misleading or unverified claims',
      'Violations are criminal offenses punishable with imprisonment up to 6 months for first offense and 1 year for repeat offense',
      'Applies equally to digital ads, social media influencers, e-commerce product pages, and packaging cartons'
    ],
    patientSafetyProvisions: [
      'Guarantees patients are not misled into delaying emergency or life-saving conventional medical interventions',
      'Protects consumer rights and enforces ethical advertising in the AYUSH ecosystem'
    ],
    patentAndIpImpact: 'Patent specifications claiming a "complete cure" for Schedule conditions face severe public order objections under Section 3(b).',
    citationReference: 'Drugs and Magic Remedies Act, 1954 (Act 21 of 1954), Section 3 & Schedule',
    tag: 'Advertising Law'
  }
];
