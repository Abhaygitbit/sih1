import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  HeartHandshake, 
  X,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { APPROVED_AYURVEDIC_PRODUCTS, AyurvedicProduct } from '../data/ayurvedicProductsData';
import { Language } from '../types';

interface AyurvedicProductsSectionProps {
  onAskAI?: (prompt: string) => void;
  language?: Language;
}

export const AyurvedicProductsSection: React.FC<AyurvedicProductsSectionProps> = ({
  onAskAI,
  language = 'en'
}) => {
  const [selectedProduct, setSelectedProduct] = useState<AyurvedicProduct | null>(null);
  const isHindi = language === 'hi';

  const HINDI_PRODUCTS: Record<string, {
    name: string;
    category: string;
    form: string;
    reference: string;
    description: string;
    rules: string[];
    safety: string;
    dosage: string;
    badges: string[];
  }> = {
    'prod-01': {
      name: 'शास्त्रीय नेत्र बिंदु (नेत्र अर्क)',
      category: 'शास्त्रीय आयुर्वेदिक औषधि',
      form: 'रोगाणुरहित जलीय नेत्र अर्क',
      reference: 'सुश्रुत संहिता, उत्तरतंत्र एवं शार्ङ्गधर संहिता',
      description: 'प्राचीन संहिताओं के अनुसार आसुत एक सौम्य शास्त्रीय नेत्र योग, जो शुष्क आंखों और थकान से तुरंत राहत प्रदान करता है।',
      rules: [
        'ड्रग्स एंड कॉस्मेटिक्स एक्ट प्रथम अनुसूची के शास्त्रीय ग्रंथों के अनुसार निर्मित',
        'शेड्यूल टी जीएमपी नेत्र बाँझपन मानकों (भाग I-F) का 100% अनुपालन',
        'पेटेंट अधिनियम धारा 3(p) के तहत पारंपरिक ज्ञान (TKDL) के रूप में सुरक्षित',
        'शेड्यूल E(1) भारी धातुओं एवं रासायनिक परिरक्षकों से पूर्णतः मुक्त'
      ],
      safety: 'सूक्ष्मजीवविज्ञानी परीक्षित, आइसोटोनिक पीएच 7.2, शून्य जलन, दैनिक उपयोग हेतु सुरक्षित।',
      dosage: 'प्रत्येक आंख में दिन में दो बार 1-2 बूंदें या आयुर्वेदाचार्य के निर्देशानुसार।',
      badges: ['शेड्यूल टी जीएमपी', 'धारा 3(p) पूर्व कला', 'परिरक्षक मुक्त', 'रोगी सुरक्षित']
    },
    'prod-02': {
      name: 'हर्बल सप्लीमेंट्स (रसायन वटी)',
      category: 'स्वामित्व (प्रोप्राइटरी) आयुर्वेदिक पूरक',
      form: 'संपीड़ित हर्बल वटी (टैबलेट)',
      reference: 'चरक संहिता, चिकित्सा स्थान, रसायन अध्याय',
      description: 'प्राकृतिक प्रतिरक्षा, ऊर्जा और जीवन शक्ति बढ़ाने के लिए मानकीकृत एंटीऑक्सीडेंट एवं कोशिकीय पुनरोद्धार वटी।',
      rules: [
        'ड्रग्स एंड कॉस्मेटिक्स रूल्स 1945 के नियम 158B के तहत सुरक्षा व स्थिरता सिद्ध',
        'FSSAI आयुष आहार अनुसूची IV दैनिक आहार दिशानिर्देशों का अनुपालन',
        'भारी धातुओं की मात्रा आयुष मानकों के सुरक्षित स्तर से काफी कम',
        'राज्य जैव विविधता बोर्ड में ABS अनुपालन विधिवत दर्ज'
      ],
      safety: 'दीर्घकालिक गैर-विषाक्तता प्रमाणित, शून्य कीटनाशक अवशेष, आंत-अनुकूल फॉर्मूलेशन।',
      dosage: 'भोजन के बाद गुनगुने पानी के साथ दिन में दो बार 1 टैबलेट।',
      badges: ['नियम 158B अनुपालित', 'FSSAI आयुष आहार', 'भारी धातु सुरक्षित', 'दैनिक रसायन']
    },
    'prod-03': {
      name: 'नीम तेल कैप्सूल (त्वचा एवं रक्त शोधक)',
      category: 'स्वामित्व आयुर्वेदिक कैप्सूल',
      form: 'शीत-पीड़ित शुद्ध नीम तेल सॉफ्टजेल कैप्सूल',
      reference: 'भावप्रकाश निघण्टु, गुडूच्यादि वर्ग',
      description: 'त्वचा विकारों, रक्त शुद्धि एवं प्राकृतिक आंतरिक डिटॉक्सिफिकेशन के लिए शुद्ध कोल्ड-प्रेस्ड नीम तेल सॉफ्टजेल।',
      rules: [
        'नियम 158B के तहत त्वरित स्थिरता परीक्षण (24 माह शेल्फ-लाइफ) प्रमाणित',
        'जैविक विविधता अधिनियम 2002 की धारा 7 के तहत राज्य जैव विविधता बोर्ड को सूचना',
        'पेटेंट अधिनियम धारा 3(p) के अनुरूप प्राकृतिक गुणों पर कोई अनुचित दावा नहीं'
      ],
      safety: 'एज़ाडिराक्टिन मानकीकृत, शून्य हेक्सेन विलायक अवशेष, यकृत सुरक्षा सत्यापित।',
      dosage: 'दिन में एक बार भोजन के बाद गुनगुने पानी से 1 कैप्सूल।',
      badges: ['नियम 158B प्रमाणित', 'कोल्ड प्रेस्ड', 'NBA ABS पंजीकृत', 'शुद्ध अर्क']
    },
    'prod-04': {
      name: 'हल्दी लेप / पेस्ट (हरिद्रा व्रणरोपक)',
      category: 'शास्त्रीय बाह्य अनुप्रयोग',
      form: 'औषधीय सामयिक इमल्शन / पेस्ट',
      reference: 'अष्टांग हृदयम्, उत्तरस्थान',
      description: 'घावों को शीघ्र भरने, सूजन कम करने और त्वचा की चमक बढ़ाने हेतु शुद्ध हरिद्रा एवं घृत से निर्मित शास्त्रीय लेप।',
      rules: [
        'प्रथम अनुसूची शास्त्रीय योग के तहत निर्माण, धारा 3(p) TKDL पूर्व कला संरक्षित',
        'शेड्यूल टी सामयिक जीएमपी स्वच्छता अनुपालन',
        'प्राकृतिक घटकों का गैर-स्पष्ट मिश्रण'
      ],
      safety: 'चर्मरोग परीक्षित, शून्य कृत्रिम रंग या सुगंध, संवेदनशील त्वचा के लिए सुरक्षित।',
      dosage: 'प्रभावित स्थान पर दिन में 2-3 बार पतला लेप लगाएं।',
      badges: ['TKDL पूर्व ज्ञान', 'शेड्यूल टी जीएमपी', 'शून्य रसायन', 'त्वचा सुरक्षित']
    },
    'prod-05': {
      name: 'अश्वगंधा अर्क कैप्सूल (तनाव मुक्ति एवं ओज)',
      category: 'स्वामित्व आयुर्वेदिक औषधि',
      form: 'मानकीकृत जड़ अर्क वेज-कैप्सूल',
      reference: 'चरक संहिता, सूत्रस्थान अध्याय 4',
      description: 'कोर्टिसोल कम करने, गहरी नींद और तंत्रिका तंत्र को मजबूत करने के लिए 5% विथेनोलाइड्स युक्त मानकीकृत अर्क।',
      rules: [
        'नियम 158B मानव नैदानिक सुरक्षा अध्ययन व स्थिरता द्वारा अनुमोदित',
        'एनबीए फॉर्म 3 भारतीय जैविक संसाधन ABS अनुपालन',
        'धारा 3(d) एवं 3(e) के तहत बायो-एन्हांसमेंट सुरक्षा अनुपालन'
      ],
      safety: 'भारी धातु (सीसा, पारा, कैडमियम, आर्सेनिक) एनएबीएल लैब द्वारा शून्य प्रमाणित।',
      dosage: 'रात को सोने से पहले गर्म दूध या पानी के साथ 1 कैप्सूल।',
      badges: ['नियम 158B क्लिनिकल', 'NBA फॉर्म 3', '5% विथेनोलाइड्स', 'मानकीकृत']
    },
    'prod-06': {
      name: 'शहतूत रस (तूथ स्वरस - चयापचय स्वास्थ्य)',
      category: 'आयुर्वेदिक आहार / स्वास्थ्य पेय',
      form: 'प्राकृतिक पाश्चुरीकृत फल स्वरस',
      reference: 'सुश्रुत संहिता, सूत्रस्थान, फलावर्ग',
      description: 'गले के संक्रमण, पाचन सुधार एवं चयापचय को संतुलित करने के लिए ताजे शहतूत से तैयार प्राकृतिक फल रस।',
      rules: [
        'FSSAI आयुष आहार विनियम 2022 के अनुसार निर्मित',
        'शून्य कृत्रिम स्वीटनर, शून्य रासायनिक परिरक्षक',
        'धारा 3(p) प्राकृतिक पोषण उत्पाद'
      ],
      safety: 'प्राकृतिक पीएच 3.8-4.2, माइक्रोबियल परीक्षण उत्तीर्ण, सभी आयु वर्गों के लिए सुरक्षित।',
      dosage: 'सुबह खाली पेट 20-30 मिली बराबर मात्रा में पानी मिलाकर पिएं।',
      badges: ['FSSAI आयुष आहार', 'प्राकृतिक रस', 'परिरक्षक रहित', '100% शुद्ध']
    }
  };

  return (
    <div id="ayurvedic-products-section" className="w-full space-y-6">
      
      {/* Section Header */}
      <div className="bg-white dark:bg-[#12281E] p-6 rounded-2xl border border-[#C8E6C9] dark:border-[#1F3F30] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-[#A5D6A7] text-[12pt] sm:text-[13pt] font-bold border border-[#C8E6C9] dark:border-[#2E5C46] mb-2">
            <ShieldCheck className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
            <span>{isHindi ? '100% कानूनी अनुपालित एवं रोगियों के लिए पूर्णतः सुरक्षित' : '100% Statutory Compliant & Safe for Patients'}</span>
          </div>
          <h2 className="text-[20pt] sm:text-[22pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
            {isHindi ? 'स्वीकृत आयुर्वेदिक उत्पाद (6 कानूनी रूप से मान्य उदाहरण)' : 'Approved Ayurvedic Products Showcase'}
          </h2>
          <p className="text-[13pt] sm:text-[14pt] text-[#2E7D32] dark:text-[#A5D6A7] mt-1 max-w-2xl leading-relaxed">
            {isHindi 
              ? 'शेड्यूल टी जीएमपी, नियम 158B, पेटेंट अधिनियम धारा 3(p), तथा जैविक विविधता अधिनियम के नियमों का कड़ाई से पालन करने वाले उत्कृष्ट उत्पाद।'
              : 'Exemplary formulations adhering strictly to Schedule T GMP, Rule 158B, Patents Act Section 3(p), and Biological Diversity Act norms.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[12pt] sm:text-[13pt] font-bold px-3 py-1.5 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-[#A5D6A7] border border-[#A5D6A7] dark:border-[#2E5C46]">
            {isHindi ? '6 परीक्षित फॉर्मूलेशन' : '6 Validated Formulations'}
          </span>
        </div>
      </div>

      {/* 6 Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {APPROVED_AYURVEDIC_PRODUCTS.map((product) => {
          const hiData = HINDI_PRODUCTS[product.id];
          const prodName = isHindi && hiData ? hiData.name : product.name;
          const prodDesc = isHindi && hiData ? hiData.description : product.description;
          const prodSafety = isHindi && hiData ? hiData.safety : product.patientSafetyProfile;
          const prodRules = isHindi && hiData ? hiData.rules : product.rulesFollowed;
          const prodBadges = isHindi && hiData ? hiData.badges : product.complianceBadges;

          return (
            <div 
              key={product.id}
              className="bg-white dark:bg-[#12281E] rounded-2xl border border-[#C8E6C9] dark:border-[#1F3F30] p-5 shadow-sm hover:border-[#2E7D32] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Product Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] border border-[#C8E6C9] dark:border-[#2E5C46] shrink-0">
                      {product.icon}
                    </span>
                    <div>
                      <h3 className="text-[16pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
                        {prodName}
                      </h3>
                      <p className="text-[12pt] sm:text-[13pt] text-[#2E7D32] dark:text-[#A5D6A7] italic font-serif">
                        {product.sanskritName}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {prodBadges.map((badge, idx) => (
                    <span 
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-[#A5D6A7] text-[11pt] sm:text-[12pt] font-bold border border-[#C8E6C9] dark:border-[#2E5C46]"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-[13pt] sm:text-[14pt] text-[#1B5E20] dark:text-[#E8F5E9] leading-relaxed">
                  {prodDesc}
                </p>

                {/* Rules Followed Highlights */}
                <div className="p-3 rounded-xl bg-[#F1F8F5] dark:bg-[#0A1A12] border border-[#C8E6C9] dark:border-[#1F3F30] space-y-1.5">
                  <p className="text-[12pt] sm:text-[13pt] font-bold text-[#1B5E20] dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                    <span>{isHindi ? 'कानूनी नियम जिनका पालन किया:' : 'Statutory Rules Followed:'}</span>
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[12pt] sm:text-[13pt] text-[#2E7D32] dark:text-[#A5D6A7]">
                    {prodRules.slice(0, 2).map((rule, rIdx) => (
                      <li key={rIdx} className="leading-snug">{rule}</li>
                    ))}
                  </ul>
                </div>

                {/* Patient Safety Box */}
                <div className="p-3 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] border border-[#A5D6A7] dark:border-[#2E5C46]">
                  <p className="text-[12pt] sm:text-[13pt] font-bold text-[#1B5E20] dark:text-white flex items-center gap-1.5 mb-0.5">
                    <HeartHandshake className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
                    <span>{isHindi ? 'रोगी सुरक्षा प्रोफ़ाइल:' : 'Patient Safety Profile:'}</span>
                  </p>
                  <p className="text-[12pt] sm:text-[13pt] text-[#2E7D32] dark:text-[#C8E6C9] leading-snug">
                    {prodSafety}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-[#C8E6C9] dark:border-[#1F3F30] flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="px-3.5 py-2 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] hover:bg-[#C8E6C9] text-[#1B5E20] dark:text-[#A5D6A7] text-[12pt] sm:text-[13pt] font-bold border border-[#A5D6A7] transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{isHindi ? 'कानूनी विवरण' : 'Legal Details'}</span>
                </button>

                {onAskAI && (
                  <button
                    onClick={() => onAskAI(
                      isHindi 
                        ? `${prodName} के लाइसेंस और पेटेंट नियमों के बारे में विस्तार से बताएं` 
                        : `Explain IP and regulatory safety rules for ${product.name}`
                    )}
                    className="px-3.5 py-2 rounded-xl bg-[#2E7D32] dark:bg-[#1F5C3E] hover:bg-[#1B5E20] text-white text-[12pt] sm:text-[13pt] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isHindi ? 'एआई से पूछें' : 'Ask AI'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-[#C8E6C9] dark:border-[#1F3F30]">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 rounded-2xl bg-[#E8F5E9] dark:bg-[#1A382B] border border-[#C8E6C9]">
                  {selectedProduct.icon}
                </span>
                <div>
                  <h3 className="text-[18pt] sm:text-[20pt] font-bold text-[#1B5E20] dark:text-white leading-tight">
                    {isHindi && HINDI_PRODUCTS[selectedProduct.id] ? HINDI_PRODUCTS[selectedProduct.id].name : selectedProduct.name}
                  </h3>
                  <p className="text-[13pt] text-[#2E7D32] dark:text-[#A5D6A7] font-serif">
                    {selectedProduct.sanskritName} • {isHindi && HINDI_PRODUCTS[selectedProduct.id] ? HINDI_PRODUCTS[selectedProduct.id].category : selectedProduct.category}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg hover:bg-[#E8F5E9] dark:hover:bg-[#1A382B] text-[#1B5E20] dark:text-[#A5D6A7] cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Classical Reference */}
            <div className="p-4 rounded-xl bg-[#F1F8F5] dark:bg-[#0A1A12] border border-[#C8E6C9] dark:border-[#1F3F30] space-y-1">
              <strong className="text-[14pt] font-bold text-[#1B5E20] dark:text-white block">
                {isHindi ? 'शास्त्रीय एवं विनियामक संदर्भ:' : 'Classical & Regulatory Reference:'}
              </strong>
              <p className="text-[13pt] text-[#2E7D32] dark:text-[#A5D6A7]">
                {isHindi && HINDI_PRODUCTS[selectedProduct.id] ? HINDI_PRODUCTS[selectedProduct.id].reference : selectedProduct.classicalReference}
              </p>
            </div>

            {/* All Rules Followed */}
            <div className="space-y-2">
              <h4 className="text-[15pt] font-bold text-[#1B5E20] dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50]" />
                <span>{isHindi ? 'विस्तृत कानूनी एवं सुरक्षा अनुपालन:' : 'Full Statutory & Safety Compliance Details:'}</span>
              </h4>
              <ul className="list-disc pl-6 space-y-2 text-[13pt] text-[#1B5E20] dark:text-[#E8F5E9]">
                {(isHindi && HINDI_PRODUCTS[selectedProduct.id] ? HINDI_PRODUCTS[selectedProduct.id].rules : selectedProduct.rulesFollowed).map((rule, idx) => (
                  <li key={idx} className="leading-relaxed">{rule}</li>
                ))}
              </ul>
            </div>

            {/* Dosage */}
            <div className="p-4 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] border border-[#A5D6A7] dark:border-[#2E5C46]">
              <strong className="text-[14pt] font-bold text-[#1B5E20] dark:text-white block mb-1">
                {isHindi ? 'प्रमाणित सेवन विधि (खुराक):' : 'Standard Clinical Dosage:'}
              </strong>
              <p className="text-[13pt] text-[#1B5E20] dark:text-[#E8F5E9]">
                {isHindi && HINDI_PRODUCTS[selectedProduct.id] ? HINDI_PRODUCTS[selectedProduct.id].dosage : selectedProduct.dosage}
              </p>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#C8E6C9] dark:border-[#1F3F30] flex justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-2.5 rounded-xl bg-[#2E7D32] text-white font-bold text-[13pt] hover:bg-[#1B5E20] cursor-pointer"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
