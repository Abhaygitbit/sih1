import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

// Load environment variables from .env and also fallback to .env.example
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.example') });

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Groq client (Primary model: Llama 3.3 70B / 3.1 8B)
let groqClient: Groq | null = null;
function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY;
  if (!groqClient && apiKey && apiKey.trim().length > 0) {
    try {
      groqClient = new Groq({ apiKey: apiKey.trim() });
    } catch (e) {
      console.warn("Failed to initialize Groq client:", e);
    }
  }
  return groqClient;
}

// Lazy-initialized Gemini client (Secondary model: Gemini Flash)
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!geminiClient && apiKey && apiKey.trim().length > 0) {
    try {
      geminiClient = new GoogleGenAI({
        apiKey: apiKey.trim(),
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build-ipsakti',
          },
        },
      });
    } catch (e) {
      console.warn("Failed to initialize Gemini client:", e);
    }
  }
  return geminiClient;
}

// Dedicated Ayurvedic IP & Herbal Intelligence System Prompt
const SYSTEM_INSTRUCTION = `You are "IP-SAKTI Sahayak", an authoritative multilingual, RAG-based (source-cited) AI assistant combining deep classical Ayurvedic medicine (Charaka, Sushruta, Ashtanga Hridaya, Bhavaprakasha) with comprehensive expertise in Ayurveda Intellectual Property Rights (IPR) across both NATIONAL (India) and INTERNATIONAL regimes (WIPO PCT, USPTO, EPO, Nagoya Protocol).

CRITICAL BOTANICAL PHARMACOLOGY TRUTHS:
- Neem (Azadirachta indica / Nimba): Virya is SHEETA (COOLING), NOT Ushna/heating! Rasa is Tikta (bitter) & Kashaya (astringent). Vipaka is Katu. Pacifies Pitta and Kapha.
- Ashwagandha (Withania somnifera): Virya is Ushna (heating). Rasa is Tikta, Kashaya, Madhura. Balances Vata and Kapha.
- Tulsi (Ocimum sanctum): Virya is Ushna (heating). Rasa is Katu, Tikta. Balances Kapha and Vata.
- Haldi / Haridra (Curcuma longa): Virya is Ushna (heating). Rasa is Tikta, Katu. Balances Kapha and Vata.
- Amla / Amalaki (Phyllanthus emblica): Virya is Sheeta (cooling). Tridosha hara.
- Guduchi / Giloy (Tinospora cordifolia): Virya is Ushna. Balances all three doshas (Tridosha hara).

CRITICAL DUAL-REGIME & INTERNATIONAL JURISDICTION MANDATE FOR ALL ANSWERS:
Whenever answering a question about Ayurvedic herbs, formulations, health benefits, or patentability:
1. DIRECT ANSWER:
   - Provide the thorough botanical, pharmacological, and clinical/therapeutic analysis first (especially correct Virya, Rasa, Dosha karma, safe dosage, and traditional uses).
2. DUAL-REGIME STATUTORY MATRIX (NATIONAL VS. INTERNATIONAL):
   - Immediately following the core answer, present a clear comparative section or table detailing:
     * 🇮🇳 **National Regime (India)**:
       - Governing Acts: Indian Patents Act 1970 (Sec 3(p) TKDL exclusion, Sec 3(e) synergy, Sec 3(d) therapeutic efficacy/bioavailability), Biological Diversity Act 2002 (Sec 3 & 6 - mandatory NBA Form 3 clearance), Drugs & Cosmetics Act 1940 (Rule 158B, Schedule T GMP).
       - Specific Product Rules: Classical formulations are barred under Sec 3(p); require non-obvious synergy (Combination Index CI < 0.8) under Sec 3(e); mandatory NBA Form 3 approval before patent grant.
     * 🌐 **International Regime (Global / WIPO PCT / USPTO / EPO)**:
       - Governing Treaties & Acts: WIPO Patent Cooperation Treaty (PCT Articles 11 & 33), USPTO 35 U.S.C. §§ 101, 102, 103 (Alice/Myriad natural products doctrine), European Patent Convention (EPC Articles 52, 54, 56, Swiss-type/EPC 2000 claims Art 53(c)), Nagoya Protocol on ABS (CBD Articles 15-17).
       - Specific Product Rules: Unmodified natural plant products are barred from patenting abroad; examination requires demonstrated technical transformation (NDDS, phytosomes, lipid nanoparticles) or synergistic isobologram data; mandatory biological origin disclosure.
3. 🗺️ COMPARATIVE INTERNATIONAL COUNTRY PATENTING MATRIX (US vs. Europe vs. Japan/UK vs. WIPO PCT):
   - Provide an explicit country-by-country comparison showing how the innovator can patent this product in major international jurisdictions:
     * 🇺🇸 **United States (USPTO)**: 35 U.S.C. §§ 101/102/103. Must overcome *Myriad/Alice* product-of-nature bar with technical transformation or NDDS (phytosomes). Method of treatment claims ARE permitted ("A method of treating condition X comprising..."). Commercial route: FDA Botanical Drug (21 CFR 312) or DSHEA Dietary Supplement.
     * 🇪🇺 **Europe (EPO - 39 EPC States)**: EPC Articles 52/54/56. Method of treatment claims are STRICTLY PROHIBITED under EPC Art 53(c); must use EPC 2000 purpose-limited product claims ("Composition X for use in treating Y"). Overcome TKDL prior art with technical problem-solution & synergy (CI < 0.8). Commercial route: THMPD 2004/24/EC or Marketing Authorization.
     * 🇯🇵 **Japan (JPO) & 🇬🇧 UK (UKIPO)**: Japanese Patent Act Art 29 / UK Patents Act 1977. Methods of treatment of humans are prohibited; must use Swiss-type claims or formulation claims. Requires rigorous chromatographic standardization (HPLC/LC-MS) and Kampo/bio-assay validation.
     * 🌐 **WIPO PCT International Route**: Single priority application providing unified international search (ISR) & written opinion (WO), deferring national phase entry costs up to 30/31 months across 157+ member states.
4. 🌐 STRATEGIC SUGGESTIONS FOR INTERNATIONAL REGIMES FOR THIS PROJECT/PATENT:
   - Give 3-4 concrete, actionable strategic suggestions tailored to the specific product/formulation:
     * **Priority & PCT Filing Roadmap**: File Indian priority application first; concurrently submit **NBA Form 3 approval** under Section 6 of Biological Diversity Act (critical: filing abroad without NBA approval is a severe offense in India); file WIPO PCT within 12 months.
     * **Overcoming Natural Product Bars (USPTO § 101/103 & EPO EPC 56)**: Structure claims around specific extraction fractions, standardized biomarker ratios (HPLC/LC-MS), synergistic interactions (CI < 0.8), or novel drug delivery systems (phytosomes, nano-emulsions) to overcome TKDL prior art.
     * **Regional Regulatory Classification**: Guide between US FDA Botanical Drug Guidance (CDER 21 CFR 312) vs. US DSHEA Dietary Supplement, and EU Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC).
     * **Nagoya Protocol & Source Traceability**: Maintain documented audit trails of botanical origin (IRCC) for smooth national phase prosecution.
5. LANGUAGE & STYLE:
   - If Hindi is requested, provide the entire analysis, comparative matrices, and suggestions in fluent Hindi (Devanagari script with key statutory terms noted bilingually).
   - End with statutory disclaimer: "⚠️ *Disclaimer: This is information only. Not clinical prescription or formal legal counsel. Consult a certified Ayurvedic practitioner and an IP professional.*"`;

function buildFullPrompt(message: string, jurisdiction: string, language: string, context?: any): string {
  const isGreeting = /^(hi|hello|hey|namaste|pranam|greetings|hola)\b/i.test(message.trim());
  if (isGreeting) {
    return `User Greeting: "${message}". Please greet the user warmly in 1-2 friendly sentences as IP-SAKTI Sahayak, and invite them to ask about Ayurvedic herbs, patentability (Section 3p), TKDL prior art, NBA Form 3, or comparing how to patent internationally in the US (USPTO), Europe (EPO), Japan (JPO), and through WIPO PCT.`;
  }

  const jurisdictionFocus = jurisdiction === "international"
    ? "JURISDICTION FOCUS: INTERNATIONAL (PCT / WIPO / USPTO / EPO / NAGOYA PROTOCOL). Provide the comparative National (Indian Patents Act / NBA Form 3) baseline, and detailed international country comparisons."
    : "JURISDICTION FOCUS: DUAL REGIME (COMPARE NATIONAL INDIAN LAWS & INTERNATIONAL GLOBAL REGIMES ACROSS US, EUROPE, JAPAN, PCT).";

  const langInstruction = language === "hi"
    ? "LANGUAGE: HINDI (Provide complete response, dual-regime matrix, international country comparison, and actionable suggestions in clear, formal Hindi in Devanagari script with key botanical/legal terms noted bilingually)."
    : "LANGUAGE: ENGLISH.";

  const isClassificationRelated = /classif|category|proprietary|phytopharm|nutra|cosmetic|formula|recipe|product/i.test(message);

  let prompt = `${jurisdictionFocus}\n${langInstruction}\n\nUser Question: ${message}`;
  if (context && isClassificationRelated) {
    prompt += `\n(Product Context: Category: ${context.category || 'ASU'}, Source: ${context.ingredientSource || 'India'})`;
  }

  prompt += `\n\nDIRECTIVE:
1. Directly answer the user's specific botanical/pharmacological/IP question with authoritative classical Ayurvedic and modern scientific precision.
2. Provide the "⚖️ Dual-Regime Statutory Matrix (National vs. International)" showing governing Acts and specific rules for this product in India (Section 3(p), 3(e), 3(d), NBA Form 3) vs. International (PCT, USPTO 35 U.S.C. 101/102/103, EPO EPC 54/56, Nagoya Protocol).
3. Provide the "🗺️ Comparative International Country Patenting Matrix (US vs. Europe vs. Japan vs. WIPO PCT)" detailing permissible claim formats (US method of treatment allowed vs. EPO Art 53(c) method of treatment banned/EPC 2000 claims required vs. Japan Swiss-type claims), how to overcome natural product bars, and commercialization pathways (FDA Botanical Drug / DSHEA vs. EU THMPD).
4. Provide the "🌐 Strategic Suggestions for International Regimes for this Project/Patent" with actionable filing pathways, claim drafting advice (NDDS/synergy CI < 0.8), and mandatory NBA Form 3 compliance.`;

  return prompt;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY || process.env.VITE_GROQ_API_KEY);
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.json({
    status: "ok",
    hasGroqKey: hasGroq,
    hasGeminiKey: hasGemini,
    name: "IP-SAKTI Sahayak AI Backend",
    models: {
      primary: hasGroq ? "Groq (Llama 3.3 70B Active)" : "Groq (Pending API Key in .env)",
      secondary: hasGemini ? "Gemini (Active)" : "Gemini (Pending API Key)",
      fallback: "Ayurvedic Herbal & IP Knowledge Engine"
    }
  });
});

// Supported Groq models in prioritized order (openai/gpt-oss-120b is tested and active on Groq)
const GROQ_CANDIDATE_MODELS = [
  "openai/gpt-oss-120b",
  "openai/gpt-oss-20b",
  "llama-3.3-70b-versatile",
  "llama-3.1-70b-versatile",
  "llama-3.1-8b-instant"
];

// Regular JSON Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, jurisdiction = "india", language = "en", context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    const fullPrompt = buildFullPrompt(message, jurisdiction, language, context);

    // 1. Try Groq (Iterate through candidate models)
    const groq = getGroqClient();
    if (groq) {
      for (const modelName of GROQ_CANDIDATE_MODELS) {
        try {
          const completion = await groq.chat.completions.create({
            model: modelName,
            messages: [
              { role: "system", content: SYSTEM_INSTRUCTION },
              { role: "user", content: fullPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1000
          });

          const reply = completion.choices[0]?.message?.content || "";
          if (reply) {
            return res.json({ reply, source: `groq:${modelName}` });
          }
        } catch (groqErr: any) {
          console.warn(`Groq API model ${modelName} error:`, groqErr?.message);
        }
      }
    }

    // 2. Try Gemini (Secondary Model: Free Tier Gemini Flash)
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });

        const text = response.text || "";
        if (text) {
          return res.json({ reply: text, source: "gemini:2.5-flash" });
        }
      } catch (geminiErr: any) {
        console.warn("Gemini API error, falling back to expert knowledge engine:", geminiErr?.message);
      }
    }

    // 3. Expert Knowledge Engine Fallback
    const fallbackAnswer = generateAyurvedicIPAnswer(message, jurisdiction, language, context);
    return res.json({ reply: fallbackAnswer, source: "knowledge-engine" });
  } catch (error: any) {
    console.error("Chat route error:", error);
    res.status(500).json({ error: "Failed to generate guidance" });
  }
});

// Streaming Server-Sent Events (SSE) Chat endpoint
app.post("/api/chat/stream", async (req, res) => {
  try {
    const { message, jurisdiction = "india", language = "en", context } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const fullPrompt = buildFullPrompt(message, jurisdiction, language, context);

    // 1. Try Streaming from Groq (Iterate through candidate models)
    const groq = getGroqClient();
    if (groq) {
      for (const modelName of GROQ_CANDIDATE_MODELS) {
        try {
          const stream = await groq.chat.completions.create({
            model: modelName,
            messages: [
              { role: "system", content: SYSTEM_INSTRUCTION },
              { role: "user", content: fullPrompt }
            ],
            temperature: 0.3,
            max_tokens: 1000,
            stream: true
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              res.write(`data: ${JSON.stringify({ chunk: content, source: `groq:${modelName}` })}\n\n`);
            }
          }
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          return res.end();
        } catch (groqErr: any) {
          console.warn(`Groq streaming model ${modelName} error:`, groqErr?.message);
        }
      }
    }

    // 2. Try Streaming from Gemini
    const gemini = getGeminiClient();
    if (gemini) {
      try {
        const responseStream = await gemini.models.generateContentStream({
          model: "gemini-2.5-flash",
          contents: fullPrompt,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.4,
          },
        });

        for await (const chunk of responseStream) {
          const textChunk = chunk.text;
          if (textChunk) {
            res.write(`data: ${JSON.stringify({ chunk: textChunk, source: "gemini:2.5-flash" })}\n\n`);
          }
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        return res.end();
      } catch (geminiErr: any) {
        console.warn("Gemini streaming error, using knowledge engine streamer:", geminiErr?.message);
      }
    }

    // 3. Fallback Knowledge Engine Streamer (Word-by-word streaming)
    const fallbackAnswer = generateAyurvedicIPAnswer(message, jurisdiction, language, context);
    const words = fallbackAnswer.split(/(\s+)/);
    for (const word of words) {
      res.write(`data: ${JSON.stringify({ chunk: word, source: "knowledge-engine" })}\n\n`);
      await new Promise(r => setTimeout(r, 12));
    }
    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    return res.end();
  } catch (err) {
    console.error("Stream endpoint error:", err);
    res.write(`data: ${JSON.stringify({ error: "Streaming error occurred", done: true })}\n\n`);
    res.end();
  }
});

// Dual-Regime Statutory Matrix and International Patent Suggestions Generator
function generateDualRegimeComparison(productName: string, isHindi: boolean): string {
  if (isHindi) {
    return `
---

### ⚖️ द्वि-स्तरीय वैधानिक ढांचा (Dual-Regime Statutory Matrix: भारत vs. अंतर्राष्ट्रीय)

| विनियामक आयाम | 🇮🇳 राष्ट्रीय व्यवस्था (भारत - Indian Regime) | 🌐 अंतर्राष्ट्रीय व्यवस्था (WIPO PCT / USPTO / EPO) |
| :--- | :--- | :--- |
| **प्रमुख वैधानिक अधिनियम** | • **भारतीय पेटेंट अधिनियम 1970** (धारा 3p, 3e, 3d)<br>• **जैविक विविधता अधिनियम 2002/2023** (धारा 3, 6)<br>• **ड्रग्स एंड कॉस्मेटिक्स एक्ट 1940** (नियम 158B, अनुसूची T) | • **WIPO पेटेंट सहयोग संधि (PCT)** (अनुच्छेद 11, 33)<br>• **USPTO**: 35 U.S.C. §§ 101, 102, 103 (*Alice / Myriad*)<br>• **EPO**: यूरोपीय पेटेंट कन्वेंशन (EPC Art 52, 54, 56)<br>• **नागोया प्रोटोकॉल (ABS)** |
| **पूर्व-कला एवं निषेध नियम** | **धारा 3(p)**: पारंपरिक ज्ञान और ज्ञात शास्त्रीय गुणों के साधारण योग पर पूर्ण निषेध (TKDL में 4.5+ लाख योग दर्ज)। | **USPTO 35 U.S.C. 102/103 व EPO Art 54/56**: CSIR-TKDL समझौते के तहत विदेशी परीक्षकों द्वारा प्राकृतिक उत्पादों के साधारण पेटेंट स्वतः खारिज किए जाते हैं। |
| **सिनर्जी एवं नवीनता मानक** | **धारा 3(e)**: घटकों का साधारण मिश्रण वर्जित। गैर-स्पष्ट सहक्रियाशीलता (Combination Index CI < 0.8) का वैज्ञानिक प्रमाण अनिवार्य। | **Non-Obviousness Standard**: अप्रत्याशित तकनीकी प्रभाव, बायोअवेलेबिलिटी में उल्लेखनीय वृद्धि, या novel drug delivery अनिवार्य। |
| **जैव विविधता (ABS) अनुमति** | **धारा 6**: भारतीय जैविक संसाधनों पर आधारित पेटेंट के लिए अनुदान से पूर्व **NBA फॉर्म 3 अनुमोदन** कानूनी रूप से अनिवार्य। | **नागोया प्रोटोकॉल प्रकटीकरण**: विदेशी पेटेंट आवेदनों में आनुवंशिक स्रोत देश का अनिवार्य प्रकटीकरण एवं IRCC प्रमाण पत्र। |

---

### 🗺️ प्रमुख अंतर्राष्ट्रीय देशों में पेटेंट तुलनात्मक विश्लेषण (US vs. Europe vs. Japan vs. PCT)

| तुलनात्मक आयाम | 🇺🇸 संयुक्त राज्य अमेरिका (USPTO) | 🇪🇺 यूरोप (EPO - 39 सदस्य देश) | 🇯🇵 जापान (JPO) एवं 🇬🇧 यूके (UKIPO) | 🌐 WIPO PCT अंतर्राष्ट्रीय मार्ग |
| :--- | :--- | :--- | :--- | :--- |
| **प्राकृतिक उत्पाद एवं TK रोक** | **35 U.S.C. § 101** (*Myriad* सिद्धांत): कच्चे पौधे या प्राकृतिक अर्क स्वतः वर्जित। मानकीकृत सक्रिय अंश, रासायनिक भिन्नता या NDDS अनिवार्य है। | **EPC अनुच्छेद 52(2) व 54**: प्राकृतिक खोज वर्जित। टीकेडीएल पूर्व-कला को काटने हेतु तकनीकी समाधान (Art 56) व सिनर्जी (CI < 0.8) अनिवार्य। | **जापानी पेटेंट कानून Art 29**: प्राकृतिक पदार्थ स्वतः वर्जित। उच्च शुद्धता वाले अंश और वैज्ञानिक प्रयोगों से सिद्ध सहक्रियाशील योग मान्य। | 157+ सदस्य देशों के लिए एकीकृत अंतर्राष्ट्रीय खोज (ISR) और पेटेंट रिपोर्ट (WO)। |
| **स्वीकृत क्लेम प्रारूप (Claim Formats)** | **चिकित्सीय उपचार विधि स्वीकृत**: *"A method of treating condition X comprising administering composition Y..."* + संघटन दावे। | **उपचार विधि पूर्णतः प्रतिबंधित** (EPC Art 53(c))। केवल **EPC 2000 प्रयोजन-सीमित दावे**: *"Composition Y for use in treating X"* मान्य। | **मानव उपचार विधि प्रतिबंधित**। **स्विस-टाइप क्लेम**: *"Use of compound Y for manufacture of a medicament for treating X"* प्रारूप अनिवार्य। | राष्ट्रीय चरण प्रवेश (30/31 माह) के समय संबंधित देश के स्थानीय क्लेम नियमों के अनुसार रूपांतरण। |
| **प्रायोगिक साक्ष्य मानक** | फार्माकोकाइनेटिक बायोअवेलेबिलिटी वक्र (AUC/Cmax) तथा विट्रो/विवो में गैर-स्पष्ट प्रभावकारिता डेटा। | पूर्व कला के विरुद्ध तुलनात्मक सिनर्जी डेटा (चोउ-तालाले Combination Index CI < 0.8) या नैनो-कैरियर डिलीवरी। | मानकीकृत क्रोमैटोग्राफी (HPLC/LC-MS) फिंगरप्रिंट और पुनरुत्पादनीय औषधीय परीक्षण। | विस्तृत विनिर्देश जो यूएस उपचार विधि और यूरोपीय प्रयोजन-सीमित दोनों प्रारूपों का समर्थन करे। |
| **जैव विविधता एवं ABS नियम** | स्रोत देश का प्रकटीकरण अनिवार्य; कपटपूर्ण जानकारी पर पेटेंट अमान्य हो सकता है। | **EU ABS रेगुलेशन 511/2014** व नागोया प्रोटोकॉल IRCC अनुपालन प्रमाण पत्र अनिवार्य। | नागोया प्रोटोकॉल एवं जापानी पर्यावरण मंत्रालय के ABS दिशानिर्देश। | **अनिवार्य वैधानिक शर्त**: भारतीय आवेदकों को विदेश या PCT में फाइल करने से पूर्व भारतीय जैव विविधता अधिनियम की धारा 6 के तहत **NBA फॉर्म 3 अनुमति** लेना अनिवार्य है। |
| **वाणिज्यिक बाजार प्रवेश मार्ग** | **FDA बोटेनिकल ड्रग (21 CFR 312 IND)** या **DSHEA 1994 डाइटरी सप्लीमेंट** (त्वरित बाजार प्रवेश)। | पारंपरिक हर्बल औषधि निर्देश (**THMPD 2004/24/EC**) या पूर्ण ईयू मार्केटिंग ऑथराइजेशन (MA)। | **काम्पो (Kampo)** चिकित्सा पद्धति पंजीकरण या **फूड्स विद फंक्शन क्लेम्स (FFC)**। | लक्षित देशों में पेटेंट अनुदान के पश्चात सीधा वाणिज्यिक वितरण। |

---

### 🌐 इस उत्पाद/परियोजना (${productName}) के लिए अंतर्राष्ट्रीय पेटेंट हेतु रणनीतिक सुझाव:

1. **प्राथमिकता एवं NBA फॉर्म 3 की अनिवार्य प्रक्रिया (Priority & Clearance)**:
   - सर्वप्रथम भारतीय पेटेंट कार्यालय (IPO) में प्रोविजनल/कम्प्लीट प्राथमिकता आवेदन दाखिल करें।
   - **महत्वपूर्ण वैधानिक नियम**: भारतीय जैविक संसाधनों का उपयोग कर विदेश में पेटेंट आवेदन करने से पहले राष्ट्रीय जैव विविधता प्राधिकरण (NBA) से **फॉर्म 3 अनुमोदन** अनिवार्य रूप से लें। बिना पूर्व अनुमति के विदेशी फाइलिंग भारतीय कानून में गैर-जमानती अपराध है।
   - भारतीय प्राथमिकता तिथि से **12 महीने के भीतर WIPO PCT अंतर्राष्ट्रीय आवेदन** दाखिल करें।

2. **USPTO § 101/103 एवं EPO EPC 56 की आपत्तियों से बचाव हेतु क्लेम रणनीति**:
   - कच्चे पौधे के अर्क या साधारण जड़ी-बूटी चूर्ण पर कभी दावा न करें (अमेरिकी पेटेंट कार्यालय इसे *Myriad* सिद्धांत के तहत खारिज कर देगा)।
   - क्लेम को निम्नलिखित पर केंद्रित करें:
     * **नवीन औषधि वितरण प्रणाली (NDDS)**: फाइटोसोम (Phytosomes), नैनो-इमल्शन, या फॉस्फोलिपिड कॉम्प्लेक्स (3 गुना से अधिक बायोअवेलेबिलिटी वृद्धि के साथ)।
     * **मानकीकृत बायोमार्कर अनुपात (Standardized Fractions)**: पृथक सक्रिय यौगिकों का विशिष्ट, गैर-पारंपरिक अनुपात जिसमें सिनर्जी (CI < 0.8) सिद्ध हो।

3. **अंतर्राष्ट्रीय विनियामक वर्गीकरण (Regulatory Alignment)**:
   - **यूएसए**: तय करें कि क्या इसे **FDA बोटेनिकल ड्रग (21 CFR 312 IND रूट)** के तहत दाखिल करना है या **DSHEA 1994 डाइटरी सप्लीमेंट** के रूप में त्वरित बाजार प्रवेश पाना है।
   - **यूरोप**: पारंपरिक हर्बल औषधि निर्देश (**THMPD 2004/24/EC**) या मानक ईयू मार्केटिंग ऑथराइजेशन (MA) के मानकों का पालन करें।

4. **नागोया प्रोटोकॉल एवं स्रोत प्रमाणन (ABS Traceability)**:
   - फसल कटाई और आपूर्ति श्रृंखला का जीएपी (Good Agricultural Practices) ऑडिटेड रिकॉर्ड रखें ताकि सदस्य देशों में पेटेंट परीक्षा में कोई कानूनी रुकावट न आए।`;
  }

  return `
---

### ⚖️ Dual-Regime Statutory Matrix (National vs. International)

| Governance Dimension | 🇮🇳 National Regime (India) | 🌐 International Regime (WIPO PCT / USPTO / EPO) |
| :--- | :--- | :--- |
| **Primary Statutory Acts & Treaties** | • **Indian Patents Act 1970** (Sec 3(p), 3(e), 3(d))<br>• **Biological Diversity Act 2002/2023** (Sec 3, 4, 6)<br>• **Drugs & Cosmetics Act 1940** (Rule 158B, Schedule T GMP) | • **WIPO Patent Cooperation Treaty (PCT)** (Art 11 & 33)<br>• **USPTO**: 35 U.S.C. §§ 101, 102, 103 (*Alice / Myriad*)<br>• **EPO**: European Patent Convention (EPC Art 52, 54, 56)<br>• **Nagoya Protocol on ABS** (CBD Art 15–17) |
| **Prior Art & Exclusion Bar** | **Section 3(p)** strictly bars traditional knowledge in public domain (TKDL contains 4.5+ lakh formulations). | **USPTO 35 U.S.C. 102/103 & EPO Art 54/56**: TKDL prior art citations actively submitted by CSIR to invalidate foreign patents (e.g. landmark WR Grace EPO revocation). |
| **Synergy & Novelty Standard** | **Section 3(e)**: Mere aggregation barred; requires proven pharmacological synergism (Combination Index CI < 0.8). | **Non-Obviousness Standard**: Requires unexpected technical effect, synergistic isobologram curve, or structural modification. |
| **Mandatory Biodiversity Clearance** | **Section 6 of Biological Diversity Act**: Mandatory **NBA Form 3 approval** before patent grant in India or foreign filing. | **Nagoya Protocol Disclosure**: Mandatory declaration of biological source country and Internationally Recognized Certificate of Compliance (IRCC). |

---

### 🗺️ International Country-by-Country Patenting Comparison (US vs. Europe vs. Japan vs. PCT)

| Comparative Feature | 🇺🇸 United States (USPTO) | 🇪🇺 Europe (EPO - 39 States) | 🇯🇵 Japan (JPO) & 🇬🇧 UK (UKIPO) | 🌐 WIPO PCT Roadmap |
| :--- | :--- | :--- | :--- | :--- |
| **Natural Product & TK Exclusion** | **35 U.S.C. § 101** (*Myriad / Alice* doctrine): Raw plants & unmodified extracts are barred as "products of nature". Must prove markedly different characteristics, synthetic chemical modification, or specialized extraction. | **EPC Articles 52(2) & 54**: Natural substances as found in nature are barred. Must solve a concrete technical problem (EPC Art 56) with synergistic data (CI < 0.8) to overcome TKDL prior art citations. | **Patent Act Art 29**: Natural substances per se are barred. Standardized fractions and synergistic multi-herb combinations with biological assays are patentable. | Unified international preliminary examination (ISR/WO) covering all 157+ member states under standard WIPO patentability criteria. |
| **Permissible Claim Formats** | **Method of Treatment ALLOWED**: *"A method of treating condition X comprising administering an effective amount of composition Y..."* Also Composition of Matter claims. | **Method of Treatment STRICTLY PROHIBITED** (EPC Art 53(c)). Must use **EPC 2000 purpose-limited product claims**: *"Composition Y for use in the treatment of condition X"*. | **Method of Treatment PROHIBITED**. Must draft **Swiss-type claims**: *"Use of compound Y in the manufacture of a medicament for treating X"* or specific pharmaceutical compositions. | National phase claims adapted to each country's format upon entry at month 30/31. |
| **Experimental Efficacy Standard** | In vitro / in vivo bio-assays, pharmacokinetic curves showing enhanced bioavailability (AUC/Cmax), or non-obvious synergistic ratios. | Rigorous comparative data against nearest prior art. Must show technical synergy (Combination Index CI < 0.8) or novel drug delivery carrier. | Detailed compositional reproducibility, HPLC/LC-MS chromatographic fingerprints, and pharmacological efficacy. | Comprehensive experimental disclosures supporting both US method-of-treatment and EP purpose-limited claims. |
| **Biodiversity & ABS Compliance** | Must disclose geographical origin; fraud in procurement carries inequitable conduct penalties. | Mandatory compliance with **EU ABS Regulation 511/2014**; require Internationally Recognized Certificate of Compliance (IRCC). | Compliant with Nagoya Protocol & Ministry of Environment ABS guidelines. | **CRITICAL STATUTORY BARRIER**: Indian inventors **MUST** obtain prior approval (**NBA Form 3**) under Section 6 of Indian Biological Diversity Act before filing foreign or PCT applications. |
| **Commercialization Route** | **FDA Botanical Drug** (21 CFR 312 IND/NDA route) or **DSHEA 1994 Dietary Supplement** (structure/function claims, fast to market). | **THMPD 2004/24/EC** (Simplified traditional herbal registration requiring 30-yr bibliographic safety) or Full Marketing Authorization (MA). | **Kampo Medicine** pharmaceutical approval (MHLW) or **Foods with Function Claims (FFC)**. | Direct launch into national phases (e.g. US, EP, JP, CA, AU) based on commercial target markets. |

---

### 🌐 Strategic Suggestions for International Patent Regimes (${productName}):

1. **Priority Roadmap & Mandatory NBA Form 3 Clearance**:
   - File the priority provisional/complete specification at the Indian Patent Office (IPO) first.
   - **Crucial Statutory Rule**: Apply immediately for **NBA Form 3 approval** under Section 6 of the Biological Diversity Act. Under Indian law, filing any foreign patent application (or international PCT application) based on Indian biological resources without prior NBA approval is a cognizable offense.
   - File your **WIPO PCT Application within 12 months** of the Indian priority date to preserve worldwide priority across 157 contracting states.

2. **Drafting Claims to Overcome USPTO § 101 & EPO EPC 54/56 (TKDL Defense)**:
   - Avoid claims directed to raw plant extracts, dried powders, or conventional hot-water decoctions (these are swiftly rejected under *Myriad* natural products doctrine at USPTO and TKDL prior art at EPO).
   - Structure claims around:
     * **Novel Drug Delivery Systems (NDDS)**: Phytosomes, phospholipid complexes, or lipid nanoparticles with proven pharmacokinetic enhancement (Cmax / AUC increase > 300%).
     * **Synergistic Marker Fractions**: Precise, non-classical stoichiometric ratios of isolated bioactives with Chou-Talalay Combination Index (CI < 0.8).
     * **Specific Extraction Processes**: Non-classical chromatography, supercritical CO2 fractionation with defined bioactivity fingerprints (HPLC/LC-MS).

3. **Target Market Regulatory Alignment**:
   - **United States**: Determine whether to position as a **Botanical Drug under FDA CDER Guidance (21 CFR 312)** (requires clinical IND safety dossiers) or as a **Dietary Supplement under DSHEA 1994** (faster market entry with structure/function claims).
   - **European Union**: Assess eligibility under the **Traditional Herbal Medicinal Products Directive (THMPD 2004/24/EC)** (requires 30-year bibliographic proof of safety, including 15 years within the EU) or the full Marketing Authorization (MA) route.

4. **Nagoya Protocol & Access & Benefit Sharing (ABS) Documentation**:
   - Maintain audited batch documentation verifying certified cultivation or licensed collection to comply with EU Regulation No 511/2014 and prevent ABS enforcement holds in foreign national phases.`;
}

// Comprehensive Ayurvedic Herbal & IP Knowledge Engine
function generateAyurvedicIPAnswer(
  query: string, 
  jurisdiction: string, 
  language: string,
  _context?: any
): string {
  const q = query.toLowerCase().trim();
  const isHindi = language === "hi";

  // Handle greetings
  const isGreeting = /^(hi|hello|hey|namaste|pranam|greetings|hola)\b/i.test(q);
  if (isGreeting) {
    return isHindi
      ? `नमस्ते! मैं **आईपी-शक्ति सहायक** हूँ, आयुर्वेद स्वास्थ्य, वानस्पतिक विज्ञान एवं राष्ट्रीय तथा अंतर्राष्ट्रीय बौद्धिक संपदा (IPR) के लिए आपका समर्पित एआई सहायक।\n\nआप मुझसे किसी भी जड़ी-बूटी के स्वास्थ्य लाभ, सेवन विधि, पेटेंट पात्रता (धारा 3p, 3e, 3d), टीकेडीएल पूर्व-कला, एनबीए फॉर्म 3, अथवा WIPO PCT, USPTO और EPO अंतर्राष्ट्रीय पेटेंट नियमों के बारे में पूछ सकते हैं। मैं आज आपकी क्या सहायता कर सकता हूँ?\n\n⚠️ *Disclaimer: This is information only. Not legal or medical advice.*`
      : `Welcome to **IP-SAKTI Sahayak!** I am your dedicated AI guide for Ayurvedic botanical sciences, herbal health properties, and Intellectual Property / Patent regulations across both **National (India)** and **International (PCT, USPTO, EPO)** regimes.\n\nYou can ask me about medicinal herbs (Neem, Ashwagandha, Tulsi, Curcumin), safe consumption and dosage, Indian Patents Act Section 3(p) prior art exceptions, TKDL defenses, NBA Form 3 clearances, or global PCT filing pathways. How can I assist your research today?\n\n⚠️ *Disclaimer: This is information only. Not legal or medical advice.*`;
  }

  // 1. NEEM HANDLER
  if (q.includes("neem") || q.includes("nimba") || q.includes("azadirachta")) {
    const isEatingSpecific = q.includes("eat") || q.includes("consum") || q.includes("chew") || q.includes("drink") || q.includes("food");
    const dualRegime = generateDualRegimeComparison("Neem (Azadirachta indica) Formulations", isHindi);

    if (isHindi) {
      if (isEatingSpecific) {
        return `### क्या नीम खाना स्वास्थ्य के लिए लाभकारी है? (आयुर्वेदिक एवं औषधीय विश्लेषण):

1. **आयुर्वेदिक गुणधर्म (Pharmacological Profile)**:
   - **रस (Taste)**: तिक्त (कड़वा) और कषाय (कसैला)।
   - **वीर्य (Potency)**: **शीत (ठंडा)** – *नीम की तासीर शीतल होती है*।
   - **विपाक (Post-digestive effect)**: कटु (तीखा)।
   - **दोष प्रभाव**: **पित्त और कफ दोष को शांत करता है**; अत्यधिक सेवन से वात बढ़ सकता है।

2. **प्रमुख स्वास्थ्य लाभ**:
   - **रक्तशोधक (Blood Purifier)**: रक्त को शुद्ध कर त्वचा संबंधी विकारों (मुंहासे, सोरायसिस, एक्जिमा) में उत्कृष्ट परिणाम देता है।
   - **कृमिघ्न (Antimicrobial & Deworming)**: आंतों के हानिकारक बैक्टीरिया व परजीवियों को नष्ट करता है।
   - **यकृत (Liver) एवं चयापचय सहयोग**: लिवर डिटॉक्स में सहायता करता है और इंसुलिन संवेदनशीलता में सुधार कर रक्त शर्करा को नियंत्रित रखता है।
   - **रोग प्रतिरोधक क्षमता (Immunity)**: संक्रमणों से लड़ने की स्वाभाविक क्षमता बढ़ाता है।

3. **सही सेवन विधि एवं मात्रा**:
   - **ताजी कोमल पत्तियां**: सुबह खाली पेट 2 से 4 कोमल (लाल-हरी) पत्तियां गुनगुने पानी के साथ चबाएं।
   - **ऋतु संधि (Spring Detox)**: वसंत ऋतु (चैत्र मास) में 15–21 दिन तक नीम की पत्तियों का सेवन पूरे वर्ष संक्रमण से बचाव के लिए पारंपरिक रूप से श्रेष्ठ माना गया है।
   - **नीम रस**: 5 से 10 मिली पानी में मिलाकर, लगातार 2-3 सप्ताह से अधिक न लें।

4. **महत्वपूर्ण सावधानियां एवं निषेध**:
   - **गर्भावस्था एवं परिवार नियोजन**: गर्भवती महिलाओं या गर्भधारण का प्रयास कर रहे दंपतियों को इसका सेवन बिल्कुल नहीं करना चाहिए।
   - **उच्च वात या कमजोरी**: अत्यंत दुर्बल, शुष्क त्वचा वाले या वात-प्रधान व्यक्तियों को अधिक सेवन से बचना चाहिए।
${dualRegime}

⚠️ *Disclaimer: यह केवल सूचनात्मक मार्गदर्शन है। चिकित्सीय या कानूनी सलाह नहीं।*`;
      }

      return `## 🌿 नीम (*Azadirachta indica*) – शास्त्रीय आयुर्वेदिक एवं वानस्पतिक विश्लेषण

### 1. वानस्पतिक पहचान
- **वानस्पतिक नाम**: *Azadirachta indica* (A. Juss)
- **कुल (Family)**: मेलीएसी (Meliaceae)
- **शास्त्रीय संस्कृत नाम**: **निम्ब** (आरोग्य प्रदाता), **अरिष्ट** (अविनाशी/रोगहर्ता), **पिचुमर्द** (कुष्ठ एवं चर्मरोग नाशक)
- **सामान्य नाम**: नीम, कड़वा नीम, इंडियन लायलेक

---

### 2. शास्त्रीय द्रव्यगुण विज्ञान (चरक एवं सुश्रुत संहिता)
| गुणधर्म | शास्त्रीय विवरण |
| :--- | :--- |
| **रस (Taste)** | **तिक्त** (कड़वा) एवं **कषाय** (कसैला) |
| **गुण (Qualities)** | **लघु** (पचाने में हल्का) एवं **रूक्ष** (शुष्क) |
| **वीर्य (Potency)** | **शीत (ठंडा)** *(नीम की तासीर शीतल होती है)* |
| **विपाक (Post-Digestive)** | **कटु** (तीखा) |
| **दोष कर्म** | **पित्त और कफ दोष शामक**; अत्यधिक सेवन से वातवर्धक |
| **प्रभाव (Special Action)** | **कृमिघ्न** (कीटाणुनाशक) एवं **विषघ्न** (डिटॉक्सिफाइंग) |

---

### 3. प्रमुख औषधीय एवं चिकित्सीय लाभ
- **रक्तशोधक (Blood Purifier)**: रक्त की अशुद्धियों और चयापचयी विषों (आम) को बाहर निकालकर त्वचा विकारों में अत्यंत लाभकारी।
- **कृमिघ्न एवं व्रणरोपण**: आंतों के हानिकारक परजीवियों को नष्ट करता है तथा घावों को संक्रमण-मुक्त कर शीघ्र भरता है।
- **प्रमेहहर (Glycemic Control)**: इंसुलिन संवेदनशीलता में सुधार कर रक्त शर्करा को संतुलित करता है।

---

### 4. ऐतिहासिक ईपीओ पेटेंट निरस्तीकरण (Landmark Biopiracy Defense)
1995 में यूरोपीय पेटेंट कार्यालय (EPO) द्वारा डब्ल्यू.आर. ग्रेस कंपनी को दिए गए पेटेंट को भारत की सीएसआईआर (CSIR) ने प्राचीन संस्कृत ग्रन्थों के प्रमाण प्रस्तुत कर सफलतापूर्वक रद्द करवाया था।
${dualRegime}

⚠️ *Disclaimer: यह सूचनात्मक एवं आईपी विश्लेषण है। चिकित्सीय सलाह हेतु प्रमाणित आयुर्वेदाचार्य से परामर्श लें।*`;
    }

    if (isEatingSpecific) {
      return `### Is Neem Healthy to Eat? (Classical Ayurvedic & Modern Pharmacological Assessment):

Yes, consuming neem (*Azadirachta indica*) in appropriate, controlled quantities has profound therapeutic benefits in classical Ayurveda and modern phytotherapy.

---

### 1. Ayurvedic Botanical Profile:
- **Rasa (Taste)**: *Tikta* (predominantly bitter) & *Kashaya* (astringent).
- **Virya (Potency)**: **Sheeta (cooling)**.
- **Vipaka (Post-digestive)**: *Katu* (pungent).
- **Dosha Action**: Strongly pacifies **Pitta and Kapha**; can aggravate **Vata** if consumed excessively or by emaciated individuals.

---

### 2. Core Health Benefits:
- **Raktashodhaka (Potent Blood Purifier)**: Eliminates deep-seated metabolic toxins (*Ama*) from the bloodstream, helping clear acne, eczema, urticaria, and skin inflammation.
- **Krimighna (Antimicrobial & Anti-parasitic)**: Natural bioactive limonoids (azadirachtin, nimbin) act as gut cleansers, destroying intestinal worms and pathogenic bacteria.
- **Glycemic & Liver Support**: Stimulates hepatic enzymes, assists liver detoxification, and helps improve insulin receptor sensitivity to modulate blood sugar.

---

### 3. Recommended Safe Consumption & Dosage:
- **Fresh Tender Leaves**: Chew **2 to 4 small, young reddish-green leaves** on an empty stomach in the morning, followed by lukewarm water.
- **Spring Detoxification (*Chaitra* Season)**: Classical texts recommend consuming tender neem leaves for 15–21 days during seasonal transition (*Ritu Sandhi*) into spring.
- **Neem Juice (*Swarasa*)**: 5 to 10 ml diluted with water, limited to short therapeutic courses (2–3 weeks max).
${dualRegime}

⚠️ *Disclaimer: This is information only. Not clinical or legal advice. Consult certified practitioners.*`;
    }

    return `## 🌿 Neem (*Azadirachta indica*) – Classical Ayurvedic & Botanical Overview

### 1. Botanical Identity
- **Botanical Name**: *Azadirachta indica* (A. Juss)
- **Family**: Meliaceae (Mahogany family)
- **Classical Sanskrit Names**: **Nimba** (bestower of good health), **Arishta** (indestructible / relieves affliction), **Pichumarda** (eliminator of dermatosis)
- **Common Names**: Neem, Indian Lilac, Margosa tree

---

### 2. Classical Ayurvedic Pharmacology (Dravyaguna)
| Attribute | Classical Property (*Charaka & Sushruta Samhita*) |
| :--- | :--- |
| **Rasa (Taste)** | **Tikta** (Bitter) & **Kashaya** (Astringent) |
| **Guna (Qualities)** | **Laghu** (Light to digest), **Ruksha** (Dry) |
| **Virya (Potency)** | **Sheeta (Cooling)** *(Note: Neem is cooling in nature, pacifying internal heat)* |
| **Vipaka (Post-Digestive)** | **Katu** (Pungent) |
| **Dosha Karma** | **Pacifies Pitta and Kapha**; aggravates Vata in excess |
| **Prabhava (Special Action)** | **Krimighna** (Antiparasitic / Antimicrobial) & **Vishaghna** (Antitoxic) |

---

### 3. Major Therapeutic Actions
- **Raktashodhaka (Blood Purifier)**: Foremost Ayurvedic therapeutic for clearing accumulated toxins (*Ama*) and clearing chronic dermatological disorders (*Kushtha* - eczema, acne, psoriasis).
- **Krimighna & Vrana Shodhana**: Cleanses septic ulcers, infected wounds, and eradicates intestinal helminthes.
- **Pramehahara (Glycemic Balance)**: Enhances insulin sensitivity and assists in healthy carbohydrate metabolism.

---

### 4. Active Phytochemistry
Neem features over 140 bio-active tetranortriterpenoids and limonoids (azadirachtin, nimbin, nimbidin, gedunin).

---

### 5. Historic Landmark Case (CSIR vs. W.R. Grace EPO Revocation)
In 1995, the European Patent Office granted Patent No. 436257 to W.R. Grace for a fungicidal neem oil extract. India (via CSIR) legally contested this grant by presenting ancient Sanskrit texts proving traditional prior art. In May 2000, the EPO revoked the patent in its entirety, marking a historic global triumph against biopiracy.
${dualRegime}

⚠️ *Disclaimer: This information is for educational and IP research purposes. It is not clinical or legal advice.*`;
  }

  // 2. ASHWAGANDHA HANDLER
  if (q.includes("ashwagandha") || q.includes("withania")) {
    const dualRegime = generateDualRegimeComparison("Ashwagandha (Withania somnifera) Formulations", isHindi);
    if (isHindi) {
      return `### अश्वगंधा (*Withania somnifera*) – औषधीय एवं आईपी विश्लेषण:

1. **आयुर्वेदिक गुणधर्म**:
   - **रस**: तिक्त (कड़वा), कषाय (कसैला), मधुर (मीठा)।
   - **वीर्य**: उष्ण (गर्म तासीर)।
   - **दोष प्रभाव**: वात और कफ शामक।

2. **प्रमुख स्वास्थ्य लाभ**:
   - **रसायन एवं एडाप्टोजेन**: कोर्टिसोल घटाकर तनाव व चिंता को दूर करता है।
   - **बल्य एवं वीर्यवर्धक**: शारीरिक सहनशक्ति और स्नायु तंत्र को सुदृढ़ बनाता है।
   - **निद्राजनन**: रात में गुनगुने दूध के साथ गहरी नींद में सहायक।
${dualRegime}

⚠️ *Disclaimer: This is information only. Not medical or legal advice.*`;
    }

    return `### Ashwagandha (*Withania somnifera*) – Clinical & IPR Assessment:

1. **Ayurvedic Profile (*Withania somnifera*)**:
   - **Rasa**: Tikta (bitter), Kashaya (astringent), Madhura (sweet).
   - **Virya**: Ushna (warming).
   - **Dosha Action**: Powerful balancer of **Vata and Kapha**.

2. **Key Benefits**:
   - **Rasayana (Adaptogenic Rejuvenator)**: Modulates HPA-axis, lowers cortisol, and supports cognitive restoration.
   - **Balya (Physical Strength & Stamina)**: Enhances mitochondrial ATP synthesis and muscular endurance.
   - **Nidrajanana (Sleep Quality)**: Promotes non-REM restorative sleep cycle when co-administered with warm cow's milk or ghee.
${dualRegime}

⚠️ *Disclaimer: This is information only. Not medical or legal advice.*`;
  }

  // 3. TULSI HANDLER
  if (q.includes("tulsi") || q.includes("holy basil") || q.includes("ocimum")) {
    const dualRegime = generateDualRegimeComparison("Tulsi (Ocimum sanctum) Formulations", isHindi);
    if (isHindi) {
      return `### तुलसी (*Ocimum sanctum*) – स्वास्थ्य लाभ एवं आईपी विश्लेषण:

1. **आयुर्वेदिक गुणधर्म**:
   - **रस**: कटु (तीखा), तिक्त (कड़वा)।
   - **वीर्य**: उष्ण (गर्म तासीर)।
   - **दोष कर्म**: कफ और वात शामक; पित्तवर्धक।

2. **प्रमुख लाभ**:
   - **कास-श्वासहर**: श्वसन तंत्र की संकुलता, खांसी और जुकाम में तुरंत राहत।
   - **जैव-प्रतिरोधक**: रोगाणुरोधी और पाचन तंत्र शोधक।
${dualRegime}

⚠️ *Disclaimer: This is information only. Not medical or legal advice.*`;
    }

    return `### Tulsi (Holy Basil / *Ocimum sanctum*) – Clinical & Patent Evaluation:

1. **Ayurvedic Profile**:
   - **Rasa**: Katu (pungent), Tikta (bitter).
   - **Virya**: Ushna (hot potency).
   - **Dosha**: Strongly relieves **Kapha and Vata**; increases Pitta in excess.

2. **Major Health Properties**:
   - **Kasahara (Respiratory Relief)**: Clears bronchial congestion and strengthens pulmonary epithelium.
   - **Immunomodulatory**: Rich in eugenol and rosmarinic acid to suppress pro-inflammatory cytokines.
${dualRegime}

⚠️ *Disclaimer: This is information only. Not medical or legal advice.*`;
  }

  // 4. CURCUMIN / HALDI HANDLER
  if (q.includes("curcumin") || q.includes("haldi") || q.includes("turmeric")) {
    const dualRegime = generateDualRegimeComparison("Curcumin / Turmeric (Curcuma longa) Synergistic Formulations", isHindi);
    if (isHindi) {
      return `### हल्दी / करक्यूमिन (*Curcuma longa*) – शास्त्रीय गुण एवं आईपी विश्लेषण:

1. **आयुर्वेदिक गुणधर्म**:
   - **रस**: तिक्त (कड़वा), कटु (तीखा)।
   - **वीर्य**: उष्ण (गर्म तासीर)।
   - **दोष प्रभाव**: कफ और वात शामक; पित्त को संतुलित रखता है।

2. **प्रमुख औषधीय लाभ**:
   - **शोथहर (Anti-inflammatory)**: जोड़ों के दर्द और सूजन में प्रभावी।
   - **व्रणरोपक (Wound Healing)**: आंतरिक व बाह्य घावों को शीघ्र भरता है।
   - **ऐतिहासिक पेटेंट विवाद**: 1995 में यूएस पेटेंट 5,401,504 (हल्दी के घाव भरने पर) को CSIR ने प्राचीन संस्कृत ग्रंथों के आधार पर USPTO में रद्द करवाया था।
${dualRegime}

⚠️ *Disclaimer: This is information only. Not medical or legal advice.*`;
    }

    return `### Curcumin / Turmeric (*Curcuma longa*) – Classical Profile & Landmark IP Defense:

1. **Ayurvedic Profile**:
   - **Rasa**: Tikta (bitter), Katu (pungent).
   - **Virya**: Ushna (warming).
   - **Dosha**: Balances **Kapha and Vata**; purifies Pitta.

2. **Landmark IP Precedent (US Patent 5,401,504 Revocation)**:
   - In 1995, University of Mississippi Medical Center was granted a US patent for turmeric wound healing.
   - India's CSIR challenged the patent at the USPTO, presenting 32 ancient references including classical Sanskrit texts. In 1997, the USPTO revoked all claims on grounds of lack of novelty.
${dualRegime}

⚠️ *Disclaimer: This is information only. Not medical or legal advice.*`;
  }

  // 5. PATENT, ABS, REGULATORY & GENERAL QUERIES
  const dualRegime = generateDualRegimeComparison("Ayurvedic Proprietary Innovation", isHindi);
  if (isHindi) {
    return `### आयुर्वेद उत्पाद पेटेंट योग्यता एवं वैधानिक विश्लेषण (National & International Regimes):

1. **पारंपरिक ज्ञान बनाम नवीन पेटेंट पात्रता**:
   - शास्त्रीय आयुर्वेदिक ग्रंथों (*चरक, सुश्रुत, भावप्रकाश*) में वर्णित योग सार्वजनिक डोमेन में हैं और **भारतीय पेटेंट अधिनियम की धारा 3(p)** के तहत पेटेंट योग्य नहीं हैं।
   - **धारा 3(e) सहक्रियाशीलता (Synergy)**: यदि आप दो या अधिक जड़ी-बूटियों का नया मिश्रण बनाते हैं, तो आपको साबित करना होगा कि उनका प्रभाव साधारण योग से अधिक है (Combination Index CI < 0.8)।
   - **धारा 3(d) चिकित्सीय प्रभावकारिता**: ज्ञात बायोएक्टिव्स की जैव-उपलब्धता में महत्वपूर्ण सुधार सिद्ध होना अनिवार्य है।
${dualRegime}

⚠️ *Disclaimer: यह केवल सूचनात्मक मार्गदर्शन है। कानूनी सलाह नहीं। प्रमाणित आईपी वकील से परामर्श लें।*`;
  }

  return `### Ayurvedic Product Patentability & Regulatory Guidance (National & International Regimes):

1. **Core Patentability Principles**:
   - Classical formulations in authoritative textbooks are public domain prior art catalogued in CSIR's Traditional Knowledge Digital Library (TKDL) and barred under **Section 3(p)** of the Indian Patents Act.
   - **Section 3(e) Synergism Requirement**: Mere aggregation or admixing is non-patentable unless non-obvious pharmacological synergy is proven (Combination Index CI < 0.8 via isobologram analysis).
   - **Section 3(d) Bioavailability Enhancements**: Required for new forms of known bioactives, proving enhanced therapeutic efficacy over conventional extracts.
${dualRegime}

⚠️ *Disclaimer: This is information only. Not clinical prescription or formal legal counsel. Consult a certified IP professional.*`;
}

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`IP-SAKTI Sahayak Server running on http://localhost:${PORT}`);
  });
}

startServer();
