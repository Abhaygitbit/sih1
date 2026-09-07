export interface AyurvedicProduct {
  id: string;
  name: string;
  sanskritName: string;
  category: string;
  form: string;
  keyIngredients: string[];
  classicalReference: string;
  rulesFollowed: string[];
  patientSafetyProfile: string;
  complianceBadges: string[];
  verificationStatus: 'Verified Safe' | 'Fully Compliant';
  icon: string;
  description: string;
  dosage: string;
}

export const APPROVED_AYURVEDIC_PRODUCTS: AyurvedicProduct[] = [
  {
    id: 'prod-01',
    name: 'Classical Eye Drop (Netra Bindu)',
    sanskritName: 'नेत्र बिन्दु (शास्त्रीय अर्क)',
    category: 'Classical Ayurvedic Medicine',
    form: 'Sterile Aqueous Ophthalmic Drops',
    keyIngredients: ['Boerhavia diffusa (Punarnava)', 'Honey (Madhu)', 'Rose Water (Gulab Jal)', 'Triphala Distillate'],
    classicalReference: 'Sushruta Samhita, Uttaratantra & Sharangadhara Samhita',
    rulesFollowed: [
      'Manufactured strictly under Drugs & Cosmetics Act First Schedule classical texts',
      'Complies with Schedule T GMP ophthalmic sterility standards (Part I-F)',
      'Protected under Patents Act Section 3(p) as prior art traditional knowledge',
      'Free from Schedule E(1) heavy metals and chemical preservatives'
    ],
    patientSafetyProfile: 'Microbiologically tested, isotonic pH 7.2, zero ocular irritation, safe for soothing dry eyes and strain.',
    complianceBadges: ['Schedule T GMP', 'Sec 3(p) Prior Art', 'Preservative Free', 'Patient Tested'],
    verificationStatus: 'Verified Safe',
    icon: '👁️',
    description: 'A soothing classical ophthalmic preparation distilled according to ancient texts, providing sterile ocular comfort.',
    dosage: '1-2 drops in each eye twice daily or as advised by an Ayurvedic practitioner.'
  },
  {
    id: 'prod-02',
    name: 'Herbal Supplements (Rasayana Vati)',
    sanskritName: 'रसायन वटी (दैनिक स्वास्थ्य संवर्धक)',
    category: 'Proprietary Ayurvedic Supplement',
    form: 'Compressed Herbal Tablets',
    keyIngredients: ['Emblica officinalis (Amalaki)', 'Tinospora cordifolia (Guduchi)', 'Glycyrrhiza glabra (Yashtimadhu)', 'Tribulus terrestris (Gokshura)'],
    classicalReference: 'Charaka Samhita, Chikitsa Sthana, Rasayana Adhyaya',
    rulesFollowed: [
      'Safety and stability proven under Drugs & Cosmetics Rules 1945, Rule 158B',
      'Complies with FSSAI Ayush Aahar Schedule IV daily dietary guidelines',
      'Heavy metals (Pb, Cd, As, Hg) verified below permissible limits of API',
      'Biodiversity ABS compliance filed with State Biodiversity Board'
    ],
    patientSafetyProfile: 'Non-toxic chronic toxicity studies verified, zero pesticide residues, gut-friendly formulation.',
    complianceBadges: ['Rule 158B Compliant', 'FSSAI Ayush Aahar', 'Heavy Metal Safe', 'Daily Rasayana'],
    verificationStatus: 'Fully Compliant',
    icon: '🌿',
    description: 'Standardized antioxidant and cellular rejuvenation tablet formulated to enhance natural immunity and vitality.',
    dosage: '1 tablet twice daily with lukewarm water after meals.'
  },
  {
    id: 'prod-03',
    name: 'Neem Oil Capsules (Nimba Taila Softgels)',
    sanskritName: 'निम्ब तैल कैप्सूल (रक्तशोधक)',
    category: 'Classical Medicated Oil Form',
    form: 'Standardized Gelatin-free Softgels',
    keyIngredients: ['Azadirachta indica (Neem seed cold-pressed oil)', 'Sesamum indicum (Til Taila base)'],
    classicalReference: 'Bhavaprakasha Nighantu & Ayurvedic Formulary of India (AFI Vol I)',
    rulesFollowed: [
      'Prepared strictly per AFI classical oil extraction and Murchhana process',
      'Biological Diversity Act 2002 Section 3/6 NBA fair-share compliant sourcing',
      'Conforms to historic neem revocation standards (EPO/USPTO non-patentable)',
      'Aflatoxin and microbiological tests verified clean'
    ],
    patientSafetyProfile: 'Purified and deodorized, safe therapeutic oral dose, tested non-hepatotoxic, supports skin and blood purification.',
    complianceBadges: ['NBA ABS Cleared', 'AFI Standardized', 'Cold-Pressed', 'Clinical Purity'],
    verificationStatus: 'Verified Safe',
    icon: '🍃',
    description: 'Cold-pressed classical neem seed oil processed with sesame oil for systemic blood purification and healthy dermal flora.',
    dosage: '1 softgel daily after food with warm water.'
  },
  {
    id: 'prod-04',
    name: 'Turmeric Paste (Haridra Lepa)',
    sanskritName: 'हरिद्रा लेप (शोथहर एवं वर्ण्य)',
    category: 'Classical Topical Lepa',
    form: 'Topical Herbal Emulsion Paste',
    keyIngredients: ['Curcuma longa (Haridra rhizome extract)', 'Santalum album (Rakta Chandana)', 'Aloe barbadensis (Kumari)'],
    classicalReference: 'Ashtanga Hridaya, Uttarasthana & CSIR-TKDL Prior Art Citations',
    rulesFollowed: [
      'Protected under TKDL documented formulations against foreign bio-piracy',
      'Complies with Drugs & Cosmetics Rule 161 labeling and shelf-life norms',
      'Exempt from patent misuse under Indian Patents Act Section 3(p)',
      'Produced in an AYUSH-certified GMP facility with water-based eco extraction'
    ],
    patientSafetyProfile: 'Dermatologically evaluated, hypoallergenic, zero parabens or artificial fragrances, safe for sensitive skin.',
    complianceBadges: ['TKDL Protected', 'Hypoallergenic', 'D&C Rule 161', 'GMP Certified'],
    verificationStatus: 'Verified Safe',
    icon: '🌱',
    description: 'Golden herbal topical paste utilizing water-soluble curcuminoids and sandalwood for natural skin healing and inflammation relief.',
    dosage: 'Apply evenly over affected skin area, leave for 15-20 minutes, then rinse gently.'
  },
  {
    id: 'prod-05',
    name: 'Ashwagandha Capsules (Ashwagandha Ghan)',
    sanskritName: 'अश्वगन्धा घन वटी (तनावमुक्ति)',
    category: 'Classical Hydro-Extract',
    form: 'Standardized Vegetable Capsules (500mg)',
    keyIngredients: ['Withania somnifera (Nagori Ashwagandha root water extract, 5% Withanolides)'],
    classicalReference: 'Charaka Samhita, Sutrasthana & AFI Part II',
    rulesFollowed: [
      'Standardized aqueous extraction strictly avoiding synthetic chemical adulterants',
      'Complies with Indian Pharmacopoeia Commission (IPC) botanical monographs',
      'Mandatory Section 3(p) disclaimer on pure botanical extracts',
      'Batch-tested for zero synthetic steroids and heavy metals'
    ],
    patientSafetyProfile: 'Clinically proven cortisol reduction, zero dependency, safe adaptogen tested across age cohorts.',
    complianceBadges: ['5% Withanolides', 'Aqueous Extract', 'Steroid Free', 'Pure Botanical'],
    verificationStatus: 'Fully Compliant',
    icon: '💊',
    description: 'Standardized full-spectrum root extract capsules supporting stress resistance, restorative sleep, and nervous system health.',
    dosage: '1 capsule at bedtime with warm milk or water.'
  },
  {
    id: 'prod-06',
    name: 'Mulberry Juice (Shahtoot Swarasa / Asava)',
    sanskritName: 'शहतूत स्वरस (मधुर रसायन)',
    category: 'Ayush Dietary Food / Swarasa',
    form: 'Pure Cold-Extracted Swarasa Drink',
    keyIngredients: ['Morus alba (Shahtoot ripe fruit swarasa)', 'Honey', 'Cinnamomum tamala (Tejpatra)'],
    classicalReference: 'Raja Nighantu & FSSAI Ayurvada Aahar Regulations 2022',
    rulesFollowed: [
      'Manufactured in accordance with FSSAI (Ayurveda Aahar) Regulations 2022',
      'Natural fermentation without added chemical acidity regulators or refined sugars',
      'Biological source verified as cultivated Indian Mulberry',
      'Nutritional profiling compliant with National Institute of Nutrition norms'
    ],
    patientSafetyProfile: 'Low glycemic load, high natural anthocyanins, safe for metabolic wellness and throat soothing.',
    complianceBadges: ['FSSAI Ayurvada Aahar', 'Zero Added Sugar', 'Rich in Polyphenols', 'Child & Adult Safe'],
    verificationStatus: 'Verified Safe',
    icon: '🍇',
    description: 'Pure cold-pressed and gently matured Indian mulberry fruit nectar rich in bioactive anthocyanins for throat and metabolic care.',
    dosage: '20-30ml mixed with an equal quantity of water twice daily.'
  }
];
