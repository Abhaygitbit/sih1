import React, { useState } from 'react';
import { 
  Scale, 
  CheckCircle2, 
  Search, 
  ChevronRight, 
  Award
} from 'lucide-react';
import { DIRECT_LAWS_DATA, CategoryLaw } from '../data/directLawsData';
import { Language } from '../types';

interface DirectLawsDashboardProps {
  onAskAI?: (query: string) => void;
  language?: Language;
}

export const DirectLawsDashboard: React.FC<DirectLawsDashboardProps> = ({ 
  onAskAI, 
  language = 'en' 
}) => {
  const [selectedLawId, setSelectedLawId] = useState<string>(DIRECT_LAWS_DATA[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const isHindi = language === 'hi';

  const HINDI_LAWS: Record<string, {
    category: string;
    actTitle: string;
    sectionOrRule: string;
    enforcingAuthority: string;
    plainSummary: string;
    keyLegalRequirements: string[];
    patientSafetyProvisions: string[];
    patentAndIpImpact: string;
    tag: string;
  }> = {
    'law-classical': {
      category: 'शास्त्रीय आयुर्वेदिक औषधियां',
      actTitle: 'औषधि एवं प्रसाधन सामग्री अधिनियम, 1940 एवं नियमावली 1945',
      sectionOrRule: 'धारा 3(a), प्रथम अनुसूची एवं नियम 161',
      enforcingAuthority: 'राज्य आयुष लाइसेंसिंग प्राधिकरण एवं आयुष मंत्रालय',
      plainSummary: 'यदि कोई औषधि प्रथम अनुसूची में सूचीबद्ध 54 मान्यता प्राप्त शास्त्रीय ग्रंथों के अनुसार ठीक-ठीक बनाई गई है, तो उसे पशु/मानव नैदानिक परीक्षणों से छूट प्राप्त है। सभी अवयवों को शास्त्रीय फार्माकोपिया मोनोग्राफ से मेल खाना चाहिए।',
      keyLegalRequirements: [
        'अवयव एवं निर्माण विधियां प्रथम अनुसूची के शास्त्रीय ग्रंथों (चरक, सुश्रुत, रसतरंगिणी आदि) से मेल खानी चाहिए',
        'निर्माण परिसर के पास वैध शेड्यूल टी जीएमपी प्रमाणन होना चाहिए एवं योग्य वैद्य की निगरानी अनिवार्य है',
        'लेबल पर विशिष्ट शास्त्रीय ग्रंथ का नाम, योग का नाम, बैच नंबर तथा आयुष लाइसेंस संख्या मुद्रित होनी चाहिए',
        'किसी भी प्रकार के आधुनिक सिंथेटिक एलोपैथिक रसायनों को मिलाना कानूनन पूर्णतः प्रतिबंधित है'
      ],
      patientSafetyProvisions: [
        'शेड्यूल E(1) की विषैली जड़ी-बूटियों (वत्सनाभ, भल्लातक आदि) का अनिवार्य शास्त्रीय शोधन आवश्यक है',
        'तैयार उत्पाद में भारी धातुओं (सीसा, कैडमियम, आर्सेनिक, पारा) का परीक्षण आयुष सीमाओं के भीतर होना अनिवार्य है',
        'बाजार में जारी करने से पहले माइक्रोबियल परीक्षण एवं कीटनाशक अवशेषों की जांच अनिवार्य है'
      ],
      patentAndIpImpact: 'पेटेंट अधिनियम की धारा 3(p) के तहत पेटेंट से कड़ाई से बाहर, क्योंकि ये शास्त्रीय नुस्खे टीकेडीएल (TKDL) में सार्वजनिक ज्ञान के रूप में सुरक्षित हैं।',
      tag: 'शास्त्रीय ASU'
    },
    'law-proprietary': {
      category: 'स्वामित्व (प्रोप्राइटरी) आयुर्वेदिक औषधियां',
      actTitle: 'औषधि एवं प्रसाधन सामग्री नियमावली, 1945',
      sectionOrRule: 'नियम 158B (सुरक्षा एवं प्रभावकारिता का साक्ष्य)',
      enforcingAuthority: 'राज्य आयुष लाइसेंसिंग प्राधिकरण एवं भारतीय चिकित्सा फार्माकोपिया आयोग',
      plainSummary: 'यदि कोई आयुर्वेदिक उत्पाद शास्त्रीय अनुपातों से इतर हर्बल संयोजनों का उपयोग करता है या नया खुराक रूप पेश करता है, तो नियम 158B के तहत लाइसेंस से पूर्व दस्तावेजी सुरक्षा डेटा, त्वरित स्थिरता परीक्षण (न्यूनतम 3 माह) तथा प्रकाशित साहित्य प्रस्तुत करना अनिवार्य है।',
      keyLegalRequirements: [
        'सभी वानस्पतिक घटक अनिवार्यतः प्रथम अनुसूची की आधिकारिक पुस्तकों में उल्लिखित होने चाहिए',
        'चिकित्सीय प्रभावकारिता सिद्ध करने वाले प्रायोगिक नैदानिक अध्ययन या प्रकाशित शोध पत्र प्रस्तुत करना',
        'न्यूनतम 2 से 3 वर्ष की शेल्फ-लाइफ प्रमाणित करने वाला वास्तविक व त्वरित स्थिरता अध्ययन डेटा',
        'NABL-मान्यता प्राप्त प्रयोगशालाओं से भारी धातु, कीटनाशक अवशेष तथा एफ्लाटॉक्सिन अनापत्ति रिपोर्ट'
      ],
      patientSafetyProvisions: [
        'जल या शास्त्रीय स्नेह के अलावा अन्य विलायक प्रयुक्त होने पर विषैला सुरक्षा डेटा अनिवार्य है',
        'पैकेजिंग पर बच्चों एवं गर्भवती महिलाओं के लिए विशिष्ट चेतावनी स्पष्ट अक्षरों में मुद्रित होनी चाहिए',
        'मानकीकृत सेवन निर्देश और सुरक्षित सेवन की अवधि स्पष्ट रूप से निर्देशित होनी चाहिए'
      ],
      patentAndIpImpact: 'धारा 3(e) के तहत पेटेंट पर विचार केवल तभी हो सकता है जब मात्रात्मक संयोजन सूचकांक (CI < 0.8) के साथ तालमेल (Synergy) सिद्ध हो, या धारा 3(d) के तहत नवीन डिलीवरी प्रणाली हो।',
      tag: 'स्वामित्व 158B'
    },
    'law-patent-3p': {
      category: 'पारंपरिक ज्ञान पेटेंट प्रतिबंध',
      actTitle: 'भारतीय पेटेंट अधिनियम, 1970 (संशोधित 2005)',
      sectionOrRule: 'धारा 3(p) एवं धारा 3(e) गैर-पेटेंट योग्यता',
      enforcingAuthority: 'भारतीय पेटेंट कार्यालय (CGPDTM) एवं CSIR-TKDL',
      plainSummary: 'धारा 3(p) उन आविष्कारों के पेटेंट पर रोक लगाती है जो ज्ञात पारंपरिक ज्ञान हैं। ज्ञात जड़ी-बूटियों (जैसे हल्दी + नीम) का मात्र मिश्रण गैर-पेटेंट योग्य है जब तक कि अप्रत्याशित चिकित्सीय तालमेल (Synergy) वैज्ञानिक रूप से प्रमाणित न हो।',
      keyLegalRequirements: [
        'आविष्कारकों को यह सिद्ध करना होगा कि दावा किया गया संयोजन केवल ज्ञात गुणों का संकलन मात्र नहीं है',
        'सीएसआईआर-टीकेडीएल डेटाबेस के 4.5 लाख से अधिक दर्ज योगों के विरुद्ध पूर्व कला परीक्षण अनिवार्य है',
        'सिंड्रोमिक तालमेल को सिद्ध करने के लिए इन-विट्रो या इन-विवो औषधिशास्त्रीय आंकड़े अनिवार्य हैं',
        'यदि पेटेंट में भारतीय जैविक संसाधनों का उपयोग हुआ है तो एनबीए फॉर्म 3 अनुमोदन अनिवार्य है'
      ],
      patientSafetyProvisions: [
        'पारंपरिक ज्ञान की जैव-तस्करी (Biopiracy) को रोकता है, जिससे प्राकृतिक औषधियां आम जनता के लिए सस्ती रहती हैं',
        'अवैज्ञानिक या अप्रमाणित दावों वाले एकाधिकार से जनस्वास्थ्य की रक्षा करता है'
      ],
      patentAndIpImpact: 'प्राकृतिक जड़ी-बूटियों के सीधे उपयोग पर कोई एकाधिकार नहीं मिल सकता। केवल नवीन निष्कर्षण तकनीक, पृथक्कृत अंश या नोवेल डिलीवरी सिस्टम ही पेटेंट योग्य हैं।',
      tag: 'पेटेंट धारा 3(p)'
    },
    'law-nba': {
      category: 'जैव विविधता एवं लाभ-साझाकरण (ABS)',
      actTitle: 'जैविक विविधता अधिनियम, 2002 एवं संशोधन अधिनियम 2023',
      sectionOrRule: 'धारा 3, 6, 7 एवं NBA विनियम (फॉर्म 1 एवं फॉर्म 3)',
      enforcingAuthority: 'राष्ट्रीय जैव विविधता प्राधिकरण (NBA) एवं राज्य जैव विविधता बोर्ड (SBB)',
      plainSummary: 'भारत के जैविक संसाधनों पर आधारित किसी भी अनुसंधान या पेटेंट के लिए लाभ-साझाकरण अनिवार्य है। भारत में या विदेश में पेटेंट अनुदान से पूर्व राष्ट्रीय जैव विविधता प्राधिकरण (NBA) से फॉर्म 3 अनुमोदन प्राप्त करना कानूनी बाध्यता है।',
      keyLegalRequirements: [
        'भारतीय जैविक संसाधनों पर आधारित पेटेंट के लिए फॉर्म 3 के तहत एनबीए से अनिवार्य पूर्व-अनुमति',
        'भारतीय निर्माताओं द्वारा वाणिज्यिक उपयोग हेतु संबंधित राज्य जैव विविधता बोर्ड को पूर्व सूचना',
        'एक्स-फैक्ट्री सकल बिक्री पर 0.1% से 0.5% का लाभ-साझाकरण (ABS) शुल्क राष्ट्रीय जैव विविधता कोष में जमा करना',
        'स्थानीय किसानों एवं पारंपरिक ज्ञान धारकों के अधिकारों का संरक्षण'
      ],
      patientSafetyProvisions: [
        'अवैध दोहन और संकटग्रस्त औषधीय पादपों के विलुप्त होने को रोकता है',
        'जड़ी-बूटियों के सतत एवं नैतिक स्रोत की पुष्टि करता है'
      ],
      patentAndIpImpact: 'एनबीए अनुमोदन के बिना पेटेंट प्राप्त करना संज्ञेय अपराध है और इसके अभाव में पेटेंट स्वतः रद्द किया जा सकता है।',
      tag: 'NBA ABS फॉर्म 3'
    },
    'law-fssai': {
      category: 'आयुष आहार एवं न्यूट्रास्युटिकल्स',
      actTitle: 'खाद्य सुरक्षा एवं मानक (आयुष आहार) विनियम, 2022',
      sectionOrRule: 'विनियम 3, 4 एवं अनुसूची I-IV',
      enforcingAuthority: 'FSSAI एवं आयुष मंत्रालय विशेषज्ञ समिति',
      plainSummary: 'दैनिक स्वास्थ्य संवर्धन के लिए बनाए गए आयुर्वेदिक खाद्य पदार्थों को "आयुष आहार" के रूप में वर्गीकृत किया जाता है। इनके लेबल पर बीमारी के इलाज का दावा नहीं किया जा सकता, केवल स्वास्थ्य संतुलन का दावा मान्य है।',
      keyLegalRequirements: [
        'उत्पाद अनिवार्यतः आधिकारिक आयुष संहिताओं में वर्णित खाद्य व्यंजनों या सामग्री से निर्मित होना चाहिए',
        'पैकेजिंग पर स्पष्ट रूप से "AYUSH AAHAR" का विशेष लोगो मुद्रित होना अनिवार्य है',
        'उपचार या दवा के रूप में विज्ञापन करना पूर्णतः निषिद्ध है',
        'दैनिक उपभोग की अधिकतम सीमा (RDA) का कड़ाई से पालन'
      ],
      patientSafetyProvisions: [
        'भारी धातु, फंगल टॉक्सिन और रोगजनक बैक्टीरिया के लिए खाद्य सुरक्षा मानकों का अनुपालन',
        'पोषक तत्वों की ओवरडोजिंग से रोगियों की सुरक्षा सुनिश्चित करता है'
      ],
      patentAndIpImpact: 'पारंपरिक व्यंजनों पर कोई पेटेंट नहीं मिल सकता। केवल विशेष पाश्चुरीकरण, शेल्फ-लाइफ स्थिरीकरण या खाद्य निष्कर्षण प्रक्रियाओं पर पेटेंट संभव है।',
      tag: 'FSSAI आयुष आहार'
    },
    'law-phytopharm': {
      category: 'फाइटोफार्मास्युटिकल औषधियां (NDDS)',
      actTitle: 'नई औषधियां एवं नैदानिक परीक्षण नियमावली, 2019',
      sectionOrRule: 'अध्याय XI एवं नियम 91-95 (फाइटोफार्मास्युटिकल्स)',
      enforcingAuthority: 'केंद्रीय औषधि मानक नियंत्रण संगठन (CDSCO / DCGI)',
      plainSummary: 'जड़ी-बूटियों के शुद्ध मानकीकृत अंशों से बनी आधुनिक दवाएं जिन्हें आधुनिक एलोपैथिक दवाओं की तरह चरण 1, 2, 3 नैदानिक परीक्षणों से गुजरना पड़ता है। इन्हें भारतीय एवं अंतरराष्ट्रीय स्तर पर मजबूत पेटेंट सुरक्षा मिलती है।',
      keyLegalRequirements: [
        'कम से कम 4 बायोएक्टिव रासायनिक मार्करों का वैज्ञानिक मानकीकरण अनिवार्य है',
        'पशु विषैला परीक्षण एवं मानव नैदानिक परीक्षण (चरण I-III) का पूरा डेटा प्रस्तुत करना',
        'ड्रग कंट्रोलर जनरल ऑफ इंडिया (DCGI) से नए औषधि निर्माण की विशेष अनुमति',
        'अंतरराष्ट्रीय फार्माकोपिया शुद्धता मानकों का कड़ाई से पालन'
      ],
      patientSafetyProvisions: [
        'मानक आधुनिक दवाओं की तरह सर्वोच्च सुरक्षा और जैव-उपलब्धता परीक्षण',
        'प्रतिकूल प्रभाव (Adverse Event) निगरानी प्रणाली अनिवार्य'
      ],
      patentAndIpImpact: 'धारा 3(p) की बाधा से पूरी तरह मुक्त! यदि नवीनता और गैर-स्पष्टता सिद्ध हो तो भारतीय एवं अंतरराष्ट्रीय पेटेंट (PCT) आसानी से प्राप्त किए जा सकते हैं।',
      tag: 'CDSCO फाइटोफार्मा'
    }
  };

  const filteredLaws = DIRECT_LAWS_DATA.filter(law => {
    const hi = HINDI_LAWS[law.id];
    const cat = isHindi && hi ? hi.category : law.category;
    const title = isHindi && hi ? hi.actTitle : law.actTitle;
    const sec = isHindi && hi ? hi.sectionOrRule : law.sectionOrRule;
    const sum = isHindi && hi ? hi.plainSummary : law.plainSummary;

    return cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sum.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const rawActiveLaw = DIRECT_LAWS_DATA.find(l => l.id === selectedLawId) || DIRECT_LAWS_DATA[0];
  const hiActive = HINDI_LAWS[rawActiveLaw.id];

  const activeCategory = isHindi && hiActive ? hiActive.category : rawActiveLaw.category;
  const activeActTitle = isHindi && hiActive ? hiActive.actTitle : rawActiveLaw.actTitle;
  const activeSectionOrRule = isHindi && hiActive ? hiActive.sectionOrRule : rawActiveLaw.sectionOrRule;
  const activeEnforcingAuthority = isHindi && hiActive ? hiActive.enforcingAuthority : rawActiveLaw.enforcingAuthority;
  const activePlainSummary = isHindi && hiActive ? hiActive.plainSummary : rawActiveLaw.plainSummary;
  const activeRequirements = isHindi && hiActive ? hiActive.keyLegalRequirements : rawActiveLaw.keyLegalRequirements;
  const activeSafety = isHindi && hiActive ? hiActive.patientSafetyProvisions : rawActiveLaw.patientSafetyProvisions;
  const activePatentImpact = isHindi && hiActive ? hiActive.patentAndIpImpact : rawActiveLaw.patentAndIpImpact;
  const activeTag = isHindi && hiActive ? hiActive.tag : rawActiveLaw.tag;

  return (
    <div id="direct-laws-dashboard" className="w-full space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#12281E] p-6 sm:p-8 rounded-2xl border border-[#C8E6C9] dark:border-[#1F3F30] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-[#A5D6A7] text-[12pt] sm:text-[13pt] font-bold border border-[#C8E6C9] dark:border-[#2E5C46]">
              <Scale className="w-4 h-4 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
              <span>{isHindi ? 'प्रत्यक्ष श्रेणी-वार कानूनी संहिता' : 'Direct Category-Wise Statutory Repository'}</span>
            </div>
            <h2 className="text-[20pt] sm:text-[22pt] font-bold text-[#1B5E20] dark:text-white leading-snug">
              {isHindi ? 'प्रत्यक्ष कानून डैशबोर्ड' : 'Direct Laws Dashboard'}
            </h2>
            <p className="text-[13pt] sm:text-[14pt] text-[#2E7D32] dark:text-[#A5D6A7] leading-relaxed max-w-2xl">
              {isHindi 
                ? 'प्रत्येक श्रेणी की आयुर्वेदिक औषधि, पेटेंट पात्रता एवं रोगी सुरक्षा को नियंत्रित करने वाले सटीक कानूनी प्रावधानों का अध्ययन करें।'
                : 'Read and inspect the exact statutory laws governing each category of Ayurvedic medicine, IP eligibility, and patient safety.'}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-5 h-5 text-[#2E7D32] dark:text-[#A5D6A7] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder={isHindi ? 'श्रेणी या कानून खोजें...' : 'Search category or statute...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F1F8F5] dark:bg-[#0A1A12] border border-[#C8E6C9] dark:border-[#1F3F30] text-[13pt] text-[#1B5E20] dark:text-[#E8F5E9] placeholder-[#2E7D32]/60 dark:placeholder-[#A5D6A7]/60 focus:outline-none focus:border-[#2E7D32]"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Law Category Buttons on Left, Active Law Reader on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Category Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[13pt] font-bold text-[#1B5E20] dark:text-white uppercase tracking-wider">
              {isHindi ? 'कानूनी श्रेणियां' : 'Statutory Categories'}
            </p>
            <span className="text-[11pt] font-bold px-2 py-0.5 rounded-full bg-[#E8F5E9] dark:bg-[#1A382B] text-[#2E7D32] dark:text-[#A5D6A7] border border-[#A5D6A7] dark:border-[#2E5C46]">
              {filteredLaws.length} {isHindi ? 'प्रावधान' : 'Statutes'}
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredLaws.map((law) => {
              const isSelected = law.id === rawActiveLaw.id;
              const hi = HINDI_LAWS[law.id];
              const catTitle = isHindi && hi ? hi.category : law.category;
              const catSec = isHindi && hi ? hi.sectionOrRule : law.sectionOrRule;
              const catTag = isHindi && hi ? hi.tag : law.tag;

              return (
                <button
                  key={law.id}
                  onClick={() => setSelectedLawId(law.id)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-[#2E7D32] dark:bg-[#1F5C3E] text-white border-[#1B5E20] dark:border-[#2E7D32] shadow-md'
                      : 'bg-white dark:bg-[#12281E] text-[#1B5E20] dark:text-[#E8F5E9] border-[#C8E6C9] dark:border-[#1F3F30] hover:bg-[#F1F8F5] dark:hover:bg-[#1A382B]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[14pt] font-bold leading-snug break-words">
                      {catTitle}
                    </span>
                    <span className={`text-[11pt] font-bold px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap ${
                      isSelected 
                        ? 'bg-white/20 text-white border border-white/30' 
                        : 'bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-[#A5D6A7] border border-[#A5D6A7] dark:border-[#2E5C46]'
                    }`}>
                      {catTag}
                    </span>
                  </div>

                  <p className={`text-[12pt] sm:text-[13pt] font-semibold leading-normal break-words ${
                    isSelected ? 'text-white/95' : 'text-[#2E7D32] dark:text-[#A5D6A7]'
                  }`}>
                    {catSec}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Direct Law Full Text Reader */}
        <div className="lg:col-span-7 bg-white dark:bg-[#12281E] p-6 sm:p-8 rounded-2xl border border-[#C8E6C9] dark:border-[#1F3F30] shadow-sm space-y-6">
          
          {/* Active Law Header */}
          <div className="border-b border-[#C8E6C9] dark:border-[#1F3F30] pb-4 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#E8F5E9] dark:bg-[#1A382B] text-[#1B5E20] dark:text-[#A5D6A7] font-bold text-[12pt] border border-[#A5D6A7] dark:border-[#2E5C46] whitespace-nowrap">
                {activeTag}
              </span>
              <span className="text-[12pt] sm:text-[13pt] text-[#2E7D32] dark:text-[#A5D6A7] font-semibold">
                {isHindi ? 'लागू करने वाला प्राधिकरण:' : 'Authority:'} <strong className="text-[#1B5E20] dark:text-white">{activeEnforcingAuthority}</strong>
              </span>
            </div>

            <h3 className="text-[19pt] sm:text-[21pt] font-bold text-[#1B5E20] dark:text-white leading-snug break-words">
              {activeActTitle}
            </h3>

            <p className="text-[15pt] sm:text-[16pt] font-bold text-[#2E7D32] dark:text-[#4CAF50] leading-snug break-words">
              {activeSectionOrRule}
            </p>
          </div>

          {/* Plain Summary */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F1F8F5] dark:bg-[#0A1A12] border border-[#C8E6C9] dark:border-[#1F3F30] space-y-1.5">
            <strong className="text-[14pt] font-bold text-[#1B5E20] dark:text-white block">
              {isHindi ? 'सरल भाषा में व्याख्या:' : 'Plain Language Explanation:'}
            </strong>
            <p className="text-[13pt] sm:text-[14pt] text-[#1B5E20] dark:text-[#E8F5E9] leading-relaxed">
              {activePlainSummary}
            </p>
          </div>

          {/* Key Legal Requirements */}
          <div className="space-y-2">
            <h4 className="text-[15pt] sm:text-[16pt] font-bold text-[#1B5E20] dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
              <span>{isHindi ? 'अनिवार्य कानूनी आवश्यकताएं:' : 'Mandatory Legal Requirements:'}</span>
            </h4>
            <ul className="list-disc pl-6 space-y-2 text-[#1B5E20] dark:text-[#E8F5E9]">
              {activeRequirements.map((req, idx) => (
                <li key={idx} className="text-[13pt] leading-relaxed">
                  {req}
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Safety Provisions */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#E8F5E9] dark:bg-[#1A382B] border border-[#A5D6A7] dark:border-[#2E5C46] space-y-2">
            <h4 className="text-[14pt] font-bold text-[#1B5E20] dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2E7D32] dark:text-[#4CAF50] shrink-0" />
              <span>{isHindi ? 'रोगी सुरक्षा एवं गुणवत्ता अधिदेश:' : 'Patient Safety & Quality Mandates:'}</span>
            </h4>
            <ul className="list-disc pl-6 space-y-1.5 text-[#1B5E20] dark:text-[#E8F5E9]">
              {activeSafety.map((safe, idx) => (
                <li key={idx} className="text-[13pt] leading-relaxed">
                  {safe}
                </li>
              ))}
            </ul>
          </div>

          {/* IP and Patent Impact */}
          <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-[#12281E] border border-[#C8E6C9] dark:border-[#1F3F30] space-y-1">
            <strong className="text-[14pt] font-bold text-[#1B5E20] dark:text-white block">
              {isHindi ? 'बौद्धिक संपदा एवं पेटेंट प्रभाव:' : 'Intellectual Property & Patent Impact:'}
            </strong>
            <p className="text-[13pt] text-[#2E7D32] dark:text-[#A5D6A7] leading-relaxed">
              {activePatentImpact}
            </p>
          </div>

          {/* Citation Reference & Ask AI Button */}
          <div className="pt-4 border-t border-[#C8E6C9] dark:border-[#1F3F30] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[12pt] text-[#2E7D32] dark:text-[#A5D6A7] italic leading-normal">
              {isHindi ? 'कानूनी उद्धरण:' : 'Citation:'} {rawActiveLaw.citationReference}
            </span>

            {onAskAI && (
              <button
                onClick={() => onAskAI(
                  isHindi
                    ? `${activeActTitle} की ${activeSectionOrRule} के तहत आवश्यक नियमों की व्याख्या करें`
                    : `Explain compliance requirements under ${activeSectionOrRule} of ${activeActTitle}`
                )}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#2E7D32] dark:bg-[#1F5C3E] hover:bg-[#1B5E20] text-white text-[13pt] font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0 whitespace-nowrap"
              >
                <span>{isHindi ? 'इस कानून पर एआई से पूछें' : 'Ask AI About This Law'}</span>
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
